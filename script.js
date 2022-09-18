class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
}

class BookModel {
  constructor() {
    this.id = 0;
    this.books = [
      {
        id: this.id++,
        book: new Book(
          "The Principles of Object-Oriented JavaScript",
          "Nicholas C. Zakas",
          120,
          false
        ),
      },
      {
        id: this.id++,
        book: new Book("You Don't Know JS Yet", "Kyle Simpson", 200, true),
      },
    ];
  }

  addBook(book) {
    this.books.push({ id: this.id++, book });

    this.onBookListChanged(this.books);
  }

  editBook(id, editedBook) {
    this.books = this.books.map((bookObj) => {
      return bookObj.id === id ? editedBook : bookObj;
    });

    this.onBookListChanged(this.books);
  }

  deleteBook(id) {
    this.books = this.books.filter((bookObj) => {
      return bookObj.id !== id;
    });

    this.onBookListChanged(this.books);
  }

  toggleReadStatus(id) {
    this.books = this.books.map((bookObj) => {
      if (id === bookObj.id) {
        bookObj.book.isRead = !bookObj.book.isRead;
      }
      return bookObj;
    });

    this.onBookListChanged(this.books);
  }

  bindBookListChanged(callback) {
    this.onBookListChanged = callback;
  }
}

class View {
  constructor() {
    this.container = this.getElement(".container");

    this.formModal = this.getElement("#form-modal");

    this.newBookForm = this.getElement("#new-book-form");

    this.newBookBtn = this.getElement("#new-book-btn");
    this.newBookBtn.addEventListener("click", this.showFormModal);

    window.addEventListener("click", (e) => {
      if (e.target == this.formModal) {
        this.hideFormModal();
      }
    });

    this.booksTable = this.getElement(".books-table");
    this.booksTableBody = this.getElement(".books-table tbody");
  }

  displayBooks(books) {
    // Delete all rows
    while (this.booksTableBody.firstChild) {
      this.booksTableBody.removeChild(this.booksTableBody.firstChild);
    }

    // Loop over each book and create table rows
    books.forEach((bookObj) => {
      const tableRow = this.createElement("tr");
      tableRow.dataset.id = bookObj.id;

      // Add Book's title, author, pages, and Read status to table row
      for (const key in bookObj.book) {
        const tableCell = this.createElement("td");
        if (key === "isRead") {
          tableCell.textContent = bookObj.book[key] ? "Read" : "Not Read";
        } else {
          tableCell.textContent = bookObj.book[key];
        }
        tableRow.append(tableCell);
      }

      // Add change read status button
      const changeStatusBtn = this.createElement("button", [
        "change-status-btn",
      ]);
      changeStatusBtn.textContent = bookObj.book.isRead ? "Unread" : "Read";
      const changeStatusBtnCell = this.createElement("td");
      changeStatusBtnCell.append(changeStatusBtn);
      tableRow.append(changeStatusBtnCell);

      // Add delete button
      const deleteBtn = this.createElement("button", ["delete-btn"]);
      deleteBtn.textContent = "Delete";
      const deleteBtnCell = this.createElement("td");
      deleteBtnCell.append(deleteBtn);
      tableRow.append(deleteBtnCell);

      this.booksTableBody.append(tableRow);
    });
  }

  createElement(tag, classNames = []) {
    const element = document.createElement(tag);
    if (classNames.length > 0) element.classList.add(classNames);

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  showFormModal = () => {
    this.formModal.style.display = "block";
  };

  hideFormModal = () => {
    this.formModal.style.display = "none";
  };

  bindAddBook(handler) {
    this.newBookForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = event.target.querySelector("input#book-title").value;
      const author = event.target.querySelector("input#book-author").value;
      const pages = event.target.querySelector("input#book-pages").value;
      const status = event.target.querySelector("input#book-read").checked;

      handler(new Book(title, author, pages, status));
      event.target.reset();
      this.hideFormModal();
    });
  }

  bindDeleteBook(handler) {
    this.booksTableBody.addEventListener("click", (event) => {
      if (event.target.className == "delete-btn") {
        const id = parseInt(
          event.target.parentElement.parentElement.dataset.id
        );

        handler(id);
      }
    });
  }

  bindToggleReadStatus(handler) {
    this.booksTableBody.addEventListener("click", (event) => {
      if (event.target.className === "change-status-btn") {
        const id = parseInt(
          event.target.parentElement.parentElement.dataset.id
        );

        handler(id);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Render books in the list
    this.onBooksListChanged(this.model.books);

    // Bind view events
    this.view.bindAddBook(this.handleAddBook);
    this.view.bindDeleteBook(this.handleDeleteBook);
    this.view.bindToggleReadStatus(this.handleToggleReadStatus);

    // Bind model events
    this.model.bindBookListChanged(this.onBooksListChanged);
  }

  onBooksListChanged = (books) => {
    this.view.displayBooks(books);
  };

  handleAddBook = (book) => {
    this.model.addBook(book);
  };

  handleEditBook = (id, editedBook) => {
    this.model.editBook(id, editedBook);
  };

  handleDeleteBook = (id) => {
    this.model.deleteBook(id);
  };

  handleToggleReadStatus = (id) => {
    this.model.toggleReadStatus(id);
  };
}

const controller = new Controller(new BookModel(), new View());
