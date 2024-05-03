const library = (function () {
  const books = [];

  function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function () {
      return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
    };
  }

  Book.prototype.toggleRead = function () {
    this.read = !this.read;
  };

  books.push(new Book("my title", "my Author", 123, false),
    new Book("my title 1", "my Author", 135, true),
    new Book("my title 2", "my Author 1", 153, false),
    new Book("my title 3", "my Author 2", 423, true),);


  function addBookToLibrary(title, author, pages, read) {
    books.push(new Book(title, author, pages, read));
    render();
  }



  const table = document.querySelector("#books-table");
  const tableBody = table.querySelector("tbody");

  function render() {
    // Clear table body
    let child = tableBody.lastElementChild;
    while (child) {
      tableBody.removeChild(child);
      child = tableBody.lastElementChild;
    }

    books.forEach(book => {
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
      deleteBookBtn.addEventListener("click", () => {
        books.splice(books.indexOf(book), 1);
        render();
      });

      const toggleReadBtn = document.createElement("button");
      toggleReadBtn.classList.add("btn");
      toggleReadBtn.textContent = book.read ? "Unread" : "read";
      toggleReadBtn.addEventListener("click", () => {
        book.toggleRead();
        render();
      });


      div.appendChild(toggleReadBtn);
      div.appendChild(deleteBookBtn);
      tdEdit.appendChild(div);
      tableRow.appendChild(tdEdit);

      tableBody.appendChild(tableRow);
    });
  }

  render();


  return {
    getBooks() {
      return books;
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

    console.log({ author, title, pages, read });
    library.addBookToLibrary(title, author, Number(pages), read);

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
