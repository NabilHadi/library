class Book {
  static id = 0;

  constructor(title, author, numOfPages, isRead) {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.isRead = isRead;
    this.id = Book.id++;
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

const LibraryStorage = (function () {
  let library = [];

  function addBookToLibrary(book) {
    library.push(book);
  }

  function removeBookFromLibrary(bookId) {
    library = library.filter((book) => {
      return book.id != bookId;
    });
  }

  return {
    addBookToLibrary,
    removeBookFromLibrary,
    get library() {
      return [...library];
    },
  };
})();

const DisplayController = (() => {
  const bookForm = document.querySelector("#add-book-form");
  const formOverlay = document.querySelector("#overlay");
  const addBookBtn = document.querySelector("#add-book-btn");
  const closeFormBtn = document.querySelector("#close-form-btn");

  function showOverlayForm() {
    formOverlay.classList.remove("hide");
    formOverlay.classList.add("show");
  }

  function hideOverlayForm() {
    formOverlay.classList.remove("show");
    formOverlay.classList.add("hide");
  }

  addBookBtn.addEventListener("click", () => {
    showOverlayForm(formOverlay);
  });

  closeFormBtn.addEventListener("click", () => {
    hideOverlayForm(formOverlay);
  });

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

    renderBooks([newBook]);
    event.target.reset();
    hideOverlayForm(formOverlay);
  });

  function renderBooks(books) {
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
        LibraryStorage.removeBookFromLibrary(book.id);
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

  return {
    renderBooks,
  };
})();

LibraryStorage.addBookToLibrary(new Book("title1", "author1", 100, false));
LibraryStorage.addBookToLibrary(new Book("title2", "author1", 105, true));
LibraryStorage.addBookToLibrary(new Book("title3", "author2", 95, true));
LibraryStorage.addBookToLibrary(new Book("title4", "author2", 120, false));

DisplayController.renderBooks(LibraryStorage.library);
