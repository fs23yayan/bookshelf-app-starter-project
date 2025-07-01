// Selector dan konstanta
const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];

// Event listener saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBook();
  });

  loadBooksFromStorage();
  renderBooks();
});

// Struktur objek buku
function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function showAlert(message, isSuccess = true) {
  let alertBox = document.getElementById('alertBox');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'alertBox';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.padding = '10px 16px';
    alertBox.style.borderRadius = '6px';
    alertBox.style.zIndex = '999';
    alertBox.style.color = 'white';
    alertBox.style.fontWeight = 'bold';
    document.body.appendChild(alertBox);
  }
  alertBox.style.backgroundColor = isSuccess ? '#4CAF50' : '#e53935';
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value.trim();
  const author = document.getElementById('inputBookAuthor').value.trim();
  const year = parseInt(document.getElementById('inputBookYear').value);
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  if (!title || !author || isNaN(year)) {
    showAlert('Mohon lengkapi semua data buku.', false);
    return;
  }

  const id = +new Date();
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  saveBooksToStorage();
  renderBooks();
  document.getElementById('inputBook').reset();
  showAlert('Buku berhasil ditambahkan!');
}

function renderBooks(filteredBooks = null) {
  const incompleteShelf = document.getElementById('incompleteBookshelfList');
  const completeShelf = document.getElementById('completeBookshelfList');

  incompleteShelf.innerHTML = '';
  completeShelf.innerHTML = '';

  const bookList = filteredBooks || books;

  for (const book of bookList) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeShelf.appendChild(bookElement);
    } else {
      incompleteShelf.appendChild(bookElement);
    }
  }
}

function createBookElement(book) {
  const container = document.createElement('div');
  container.setAttribute('data-bookid', book.id);
  container.setAttribute('data-testid', 'bookItem');
  container.style.marginBottom = '12px';
  container.style.padding = '12px';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '8px';
  container.style.backgroundColor = '#fff';
  container.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.innerText = `Tahun: ${book.year}`;

  const actionContainer = document.createElement('div');
  actionContainer.style.marginTop = '10px';

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.style.marginLeft = '8px';
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit buku';
  editButton.style.marginLeft = '8px';
  editButton.addEventListener('click', () => editBook(book.id));

  actionContainer.append(toggleButton, deleteButton, editButton);

  container.append(title, author, year, actionContainer);
  return container;
}

function toggleBookStatus(id) {
  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) return;
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  saveBooksToStorage();
  renderBooks();
  showAlert('Status buku diperbarui.');
}

function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  saveBooksToStorage();
  renderBooks();
  showAlert('Buku telah dihapus.');
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  const newTitle = prompt('Judul baru:', book.title);
  const newAuthor = prompt('Penulis baru:', book.author);
  const newYear = prompt('Tahun baru:', book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle.trim();
    book.author = newAuthor.trim();
    book.year = parseInt(newYear);
    saveBooksToStorage();
    renderBooks();
    showAlert('Data buku berhasil diperbarui.');
  }
}

function searchBook() {
  const query = document.getElementById('searchBookTitle').value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(query));
  renderBooks(filtered);
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooksFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  } else {
    // Dummy data for testing
    books = [
      generateBookObject(1111, 'Atomic Habits', 'James Clear', 2018, false),
      generateBookObject(2222, 'The Pragmatic Programmer', 'Andy Hunt', 1999, true)
    ];
    saveBooksToStorage();
  }
}
