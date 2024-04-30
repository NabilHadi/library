const library = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  this.info = function () {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not read yet"}`;
  };
}


function addBookToLibrary(title, author, pages, read) {
  library.push(new Book(title, author, pages, read));
}

function displayBooks() {
  const tableBody = document.querySelector("#books-table tbody");

  // Clear table body
  let child = tableBody.lastElementChild;
  while (child) {
    tableBody.removeChild(child);
    child = tableBody.lastElementChild;
  }

  // Add books to table
  library.forEach(book => {
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

    tableBody.appendChild(tableRow);
  });
}
const formDialog = document.querySelector("#form_dialog");
const newBookForm = document.querySelector("#new_book_form");
newBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const author = document.querySelector("#author_input").value;
  const title = document.querySelector("#title_input").value;
  const pages = document.querySelector("#pages_input").value;
  const read = document.querySelector("#read_input").checked;

  console.log({ author, title, pages, read });
  addBookToLibrary(title, author, Number(pages), read);
  displayBooks();
  newBookForm.reset();
  formDialog.close();

  // newBookForm.reset();

});
const newBookBtn = document.querySelector("#new_book_btn");
newBookBtn.addEventListener("click", () => {
  formDialog.showModal();
});
const dialogCloseBtn = document.querySelector("#form_dialog_close_btn");
dialogCloseBtn.addEventListener("click", () => {
  formDialog.close();
});

addBookToLibrary("my title", "my Author", 123, false);
addBookToLibrary("my title 1", "my Author", 135, true);
addBookToLibrary("my title 2", "my Author 1", 153, false);
addBookToLibrary("my title 3", "my Author 2", 423, true);
displayBooks();