const library = (function () {

  // Book constructor
  function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  Book.prototype.info = function () {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
  };

  Book.prototype.toggleRead = function () {
    this.read = !this.read;
  };

  let currentId = 0;
  const books = [];
  // Book row component
  function createBookRow({ title, author, pages, read }, onBookDelete, onReadToggle) {
    const id = currentId++;
    const book = new Book(title, author, pages, read);

    const tableRow = document.createElement("tr");
    const tdTitle = document.createElement("td");
    tdTitle.textContent = book.title;
    tableRow.appendChild(tdTitle);

    const tdAuthor = document.createElement("td");
    tdAuthor.textContent = book.author;
    tableRow.appendChild(tdAuthor);

    const tdPages = document.createElement("td");
    tdPages.textContent = book.pages;
    tableRow.appendChild(tdPages);

    const tdRead = document.createElement("td");
    tdRead.textContent = book.read ? "Read" : "Not read yet";
    tableRow.appendChild(tdRead);

    const tdEdit = document.createElement("td");
    const div = document.createElement("div");
    div.classList.add("book_edit_container");
    const deleteBookBtn = document.createElement("button");
    deleteBookBtn.classList.add("btn");
    deleteBookBtn.textContent = "REMOVE";

    function deleteBook() {
      deleteBookBtn.removeEventListener("click", deleteBook);
      toggleReadBtn.removeEventListener("click", toggleRead);
      tableRow.remove();
      onBookDelete && onBookDelete(id);
    }

    deleteBookBtn.addEventListener("click", deleteBook);

    const toggleReadBtn = document.createElement("button");
    toggleReadBtn.classList.add("btn");
    toggleReadBtn.textContent = book.read ? "Unread" : "read";

    function toggleRead() {
      book.toggleRead();
      tdRead.textContent = book.read ? "Read" : "Not read yet";
      onReadToggle && onReadToggle();
    }

    toggleReadBtn.addEventListener("click", toggleRead);


    div.appendChild(toggleReadBtn);
    div.appendChild(deleteBookBtn);
    tdEdit.appendChild(div);
    tableRow.appendChild(tdEdit);


    return {
      id,
      row: tableRow,
      deleteBook,
      toggleRead,
    };
  }

  function onBookDelete(id) {
    const i = books.findIndex(book => book.id === id);
    if (i < 0) return;
    books.splice(books.indexOf(i), 1);
    render();
  }

  function addBookToLibrary(...newBooks) {
    newBooks.forEach(({ title, author, pages, read }) => {
      books.push(createBookRow({ title, author, pages, read }, onBookDelete));
    });
    render();
  }

  const table = document.querySelector("#books-table");
  const tableBody = table.querySelector("tbody");

  function render() {
    books.forEach(book => {
      tableBody.appendChild(book.row);
    });
  }

  // Add books
  addBookToLibrary(
    { title: "my title", author: "my Author", pages: 123, read: false },
    { title: "my title 1", author: "my Author", pages: 135, read: true },
    { title: "my title 2", author: "my Author 1", pages: 153, read: false },
    { title: "my title 3", author: "my Author 2", pages: 423, read: true });


  return {
    getBooks() {
      return [...books];
    },
    addBookToLibrary
  };

})();

const bookForm = (function () {
  // Cache Dom
  const formContainer = document.querySelector("#form_module_container");
  const formDialog = formContainer.querySelector("#form_dialog");
  const form = formContainer.querySelector("#new_book_form");
  const newBookBtn = formContainer.querySelector("#new_book_btn");
  const dialogCloseBtn = formContainer.querySelector("#form_dialog_close_btn");

  // Bind events
  form.addEventListener("submit", handleFormSubmit);
  newBookBtn.addEventListener("click", handleNewBookBtnClick);
  dialogCloseBtn.addEventListener("click", handleDialogCloseBtnClick);


  function handleFormSubmit(e) {
    e.preventDefault();

    const author = document.querySelector("#author_input").value;
    const title = document.querySelector("#title_input").value;
    const pages = document.querySelector("#pages_input").value;
    const read = document.querySelector("#read_input").checked;

    library.addBookToLibrary({ title, author, pages: Number(pages), read });

    form.reset();
    formDialog.close();

  }

  function handleNewBookBtnClick() {
    formDialog.showModal();
  }

  function handleDialogCloseBtnClick() {
    formDialog.close();
  }

})();
