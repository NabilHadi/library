const myLibrary = [];
let id = 0;

class Book {
  constructor(title, author, numOfPages, isRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.isRead = isRead;
    this.id = id++;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.numOfPages} pages, ${
      this.isRead ? "read" : "not read yet"
    }`;
  }

  toggleRead() {
    this.isRead ? (this.isRead = false) : (this.isRead = true);
  }
}

// function Book(title, author, numOfPages, isRead) {
//   this.title = title;
//   this.author = author;
//   this.numOfPages = numOfPages;
//   this.isRead = isRead;
//   this.id = id++;
// }

// Book.prototype.info = function () {
//   return `${this.title} by ${this.author}, ${this.numOfPages} pages, ${
//     this.isRead ? "read" : "not read yet"
//   }`;
// };

// Book.prototype.toggleRead = function () {
//   this.isRead ? (this.isRead = false) : (this.isRead = true);
// };

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function renderBooks(...books) {
  const container = document.querySelector(".container");
  for (const book of books) {
    const cardContainer = document.createElement("div");
    const title = document.createElement("div");
    const author = document.createElement("div");
    const numOfPages = document.createElement("div");
    const status = document.createElement("div");
    const deleteBtn = document.createElement("div");

    cardContainer.classList.add("card");
    title.classList.add("title");
    author.classList.add("author");
    numOfPages.classList.add("number-pages");
    status.classList.add("status");
    deleteBtn.classList.add("btn", "delete-book-btn");

    title.textContent = book.title;
    author.textContent = book.author;
    numOfPages.textContent = book.numOfPages;
    status.textContent = book.isRead ? "Read" : "Not Read Yet";
    deleteBtn.textContent = "Remove";

    deleteBtn.addEventListener("click", () => {
      myLibrary.splice(myLibrary.indexOf(book), 1);
      cardContainer.remove();
    });

    status.addEventListener("click", (event) => {
      book.toggleRead();
      event.target.textContent = book.isRead ? "Read" : "Not Read Yet";
    });

    cardContainer.dataset.index = book.id;
    cardContainer.append(title, author, numOfPages, status, deleteBtn);
    container.append(cardContainer);
  }
}

function showOverlayForm(formOverlay) {
  formOverlay.classList.remove("hide");
  formOverlay.classList.add("show");
}

function hideOverlayForm(formOverlay) {
  formOverlay.classList.remove("show");
  formOverlay.classList.add("hide");
}

const formOverlay = document.querySelector("#overlay");

const addBookBtn = document.querySelector("#add-book-btn");
addBookBtn.addEventListener("click", (event) => {
  showOverlayForm(formOverlay);
});

const closeFormBtn = document.querySelector("#close-form-btn");
closeFormBtn.addEventListener("click", (event) => {
  hideOverlayForm(formOverlay);
});

const bookForm = document.querySelector("#add-book-form");
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bookTitle = event.target.querySelector("#form-book-title");
  const bookAuthor = event.target.querySelector("#form-book-author");
  const bookPages = event.target.querySelector("#form-book-pages");
  const bookStatus = event.target.querySelector("#form-book-read-status");

  const newBook = new Book(
    bookTitle.value,
    bookAuthor.value,
    bookPages.value,
    bookStatus.value === "read" ? true : false
  );

  renderBooks(newBook);
  event.target.reset();
  hideOverlayForm(formOverlay);
});

addBookToLibrary(new Book("title1", "author1", 100, false));
addBookToLibrary(new Book("title2", "author1", 105, true));
addBookToLibrary(new Book("title3", "author2", 95, true));
addBookToLibrary(new Book("title4", "author2", 120, false));

renderBooks(...myLibrary);
