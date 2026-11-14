// Data awal buku (bisa kamu tambah atau ubah sesuka hati)
const initialBooks = [
    { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata", category: "Novel", available: true },
    { id: 2, title: "Belajar Dasar HTML & CSS", author: "Budi Raharjo", category: "Teknologi", available: true },
    { id: 3, title: "Matematika Kelas XI", author: "Kemendikbud", category: "Pelajaran", available: true },
    { id: 4, title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Novel", available: true },
    { id: 5, title: "Logika Algoritma Pemrograman", author: "Rinaldi Munir", category: "Teknologi", available: true },
    { id: 6, title: "Fisika Dasar SMA", author: "Marthen Kanginan", category: "Pelajaran", available: true }
    const initialBooks = [
    { 
        id: 1, 
        title: "Laskar Pelangi", 
        author: "Andrea Hirata", 
        category: "Novel", 
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80", // Ganti dengan link gambar atau "images/nama-file.jpg"
        available: true 
    },
    { 
        id: 2, 
        title: "Belajar Dasar HTML & CSS", 
        author: "Budi Raharjo", 
        category: "Teknologi", 
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
        available: true 
    },
    { 
        id: 3, 
        title: "Matematika Kelas XI", 
        author: "Kemendikbud", 
        category: "Pelajaran", 
        cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
        available: true 
    }
    // Lakukan hal yang sama untuk buku lainnya...
];
];

// Ambil data dari localStorage atau gunakan data awal jika belum ada
let books = JSON.parse(localStorage.getItem('libraryBooks')) || initialBooks;
let borrowedRecords = JSON.parse(localStorage.getItem('borrowedRecords')) || [];

// Elemen DOM
const bookListEl = document.getElementById('bookList');
const borrowedListEl = document.getElementById('borrowedList');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('borrowModal');
const borrowForm = document.getElementById('borrowForm');

// Simpan perubahan ke localStorage
function saveData() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    localStorage.setItem('borrowedRecords', JSON.stringify(borrowedRecords));
}

// Menampilkan daftar buku
function renderBooks() {
    const keyword = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    bookListEl.innerHTML = '';

    const filteredBooks = books.filter(book => {
        const matchKeyword = book.title.toLowerCase().includes(keyword) || book.author.toLowerCase().includes(keyword);
        const matchCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
        return matchKeyword && matchCategory;
    });

    if (filteredBooks.length === 0) {
        bookListEl.innerHTML = '<p>Buku tidak ditemukan.</p>';
        return;
    }

    filteredBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        card.innerHTML = `
       <div>
                <img src="${book.cover}" alt="${book.title}" class="book-cover">
                <span class="badge badge-category">${book.category}</span>
                <div class="book-title">${book.title}</div>
                <div class="book-author">Penulis: ${book.author}</div>
            </div>
            <div>
                <div class="${book.available ? 'status-available' : 'status-borrowed'}">
                    ${book.available ? '● Tersedia' : '● Sedang Dipinjam'}
                </div>
                <button 
                    class="${book.available ? 'btn-primary' : 'btn-disabled'}" 
                    ${book.available ? `onclick="openModal(${book.id})"` : 'disabled'}>
                    ${book.available ? 'Pinjam Buku' : 'Tidak Tersedia'}
                </button>
            </div>
        `; 
            <div>
                <span class="badge badge-category">${book.category}</span>
                <div class="book-title">${book.title}</div>
                <div class="book-author">Penulis: ${book.author}</div>
            </div>
            <div>
                <div class="${book.available ? 'status-available' : 'status-borrowed'}">
                    ${book.available ? '● Tersedia' : '● Sedang Dipinjam'}
                </div>
                <button 
                    class="${book.available ? 'btn-primary' : 'btn-disabled'}" 
                    ${book.available ? `onclick="openModal(${book.id})"` : 'disabled'}>
                    ${book.available ? 'Pinjam Buku' : 'Tidak Tersedia'}
                </button>
            </div>
        `;
        bookListEl.appendChild(card);
    });
}

// Menampilkan tabel peminjaman aktif
function renderBorrowed() {
    borrowedListEl.innerHTML = '';

    if (borrowedRecords.length === 0) {
        borrowedListEl.innerHTML = '<tr><td colspan="6" style="text-align:center;">Belum ada buku yang dipinjam.</td></tr>';
        return;
    }

    borrowedRecords.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.studentName}</td>
            <td>${record.studentClass}</td>
            <td><strong>${record.bookTitle}</strong></td>
            <td>${record.borrowDate}</td>
            <td><span style="color:#dc2626; font-weight:bold;">${record.dueDate}</span></td>
            <td>
                <button class="btn-return" onclick="returnBook(${index}, ${record.bookId})">Kembalikan</button>
            </td>
        `;
        borrowedListEl.appendChild(row);
    });
}

// Buka Pop-up Form Peminjaman
function openModal(bookId) {
    const book = books.find(b => b.id === bookId);
    document.getElementById('selectedBookId').value = book.id;
    document.getElementById('selectedBookTitle').innerText = book.title;
    modal.style.display = 'flex';
}

// Tutup Pop-up
function closeModal() {
    modal.style.display = 'none';
    borrowForm.reset();
}

// Proses Peminjaman Buku
borrowForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const bookId = parseInt(document.getElementById('selectedBookId').value);
    const studentName = document.getElementById('studentName').value;
    const studentClass = document.getElementById('studentClass').value;

    const bookIndex = books.findIndex(b => b.id === bookId);
    
    // Hitung tanggal hari ini dan 7 hari ke depan
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 7);

    const formatDate = (date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Ubah status buku jadi tidak tersedia
    books[bookIndex].available = false;

    // Tambahkan ke daftar peminjaman
    borrowedRecords.push({
        bookId: bookId,
        bookTitle: books[bookIndex].title,
        studentName: studentName,
        studentClass: studentClass,
        borrowDate: formatDate(today),
        dueDate: formatDate(due)
    });

    saveData();
    renderBooks();
    renderBorrowed();
    closeModal();
});

// Proses Pengembalian Buku
function returnBook(recordIndex, bookId) {
    if (confirm('Konfirmasi bahwa buku ini sudah dikembalikan ke rak perpustakaan?')) {
        // Ubah status buku kembali tersedia
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].available = true;
        }

        // Hapus dari daftar peminjaman aktif
        borrowedRecords.splice(recordIndex, 1);

        saveData();
        renderBooks();
        renderBorrowed();
    }
}

// Event Listener untuk pencarian & filter
searchInput.addEventListener('input', renderBooks);
categoryFilter.addEventListener('change', renderBooks);

// Jalankan pertama kali saat halaman dibuka
renderBooks();
renderBorrowed();
