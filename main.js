// Do your work here...
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
});

// Struktur objek buku
function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = parseInt(document.getElementById('inputBookYear').value);
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const id = +new Date();
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  saveBooksToStorage();
  renderBooks();
  document.getElementById('inputBook').reset();
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

  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.innerText = 'Edit buku';
  editButton.addEventListener('click', () => editBook(book.id));

  actionContainer.append(toggleButton, deleteButton, editButton);

  container.append(title, author, year, actionContainer);
  return container;
}

function toggleBookStatus(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveBooksToStorage();
  renderBooks();
}

function deleteBook(id) {
  books = books.filter(b => b.id !== id);
  saveBooksToStorage();
  renderBooks();
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  const newTitle = prompt('Judul baru:', book.title);
  const newAuthor = prompt('Penulis baru:', book.author);
  const newYear = prompt('Tahun baru:', book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = parseInt(newYear);
    saveBooksToStorage();
    renderBooks();
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
  }
  renderBooks();
}

