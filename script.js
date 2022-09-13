let myLibrary = [];
let tableRowsArray = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "read" : "not read"
  }`;
};

function addBookToLibrary(title, author, pages, isRead) {
  let book = new Book(title, author, pages, isRead);
  myLibrary.push(book);
}

function displayBooks() {
  // Clear table rows
  tableRowsArray.forEach((row) => row.remove());
  tableRowsArray = [];

  // Loop over each book in library and map them to table rows
  const rows = myLibrary.map(({ title, author, pages, isRead }, index) => {
    const tableRow = document.createElement("tr");
    tableRow.dataset.index = index;
    // Add Book's title, author, and pages to table row
    for (const key of [title, author, pages]) {
      const tableCell = document.createElement("td");
      tableCell.textContent = key;
      tableRow.append(tableCell);
    }
    // Add Book Read Status to table row
    const readStatusCell = document.createElement("td");
    readStatusCell.textContent = isRead ? "Read" : "Not Read";
    tableRow.append(readStatusCell);

    // Add change read status button
    const changeStatusBtn = document.createElement("button");
    changeStatusBtn.textContent = isRead ? "Unread" : "Read";
    changeStatusBtn.addEventListener("click", () => {
      myLibrary[index].isRead = !myLibrary[index].isRead;
      readStatusCell.textContent = myLibrary[index].isRead
        ? "Read"
        : "Not Read";
    });
    const changeStatusBtnCell = document.createElement("td");
    changeStatusBtnCell.append(changeStatusBtn);
    tableRow.append(changeStatusBtnCell);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    const deleteBtnCell = document.createElement("td");
    deleteBtnCell.append(deleteBtn);
    deleteBtn.addEventListener("click", () => {
      myLibrary.splice(index, 1);
      tableRowsArray[index].remove();
      displayBooks();
    });
    tableRow.append(deleteBtnCell);

    return tableRow;
  });

  // Add table rows to table body
  const tableBody = document.querySelector(".books-table tbody");
  tableBody.append(...rows);
  tableRowsArray.push(...rows);
}

addBookToLibrary(
  "The Principles of Object-Oriented JavaScript",
  "Nicholas C. Zakas",
  120,
  false
);
addBookToLibrary("You Don't Know JS Yet", "Kyle Simpson", 200, true);
displayBooks();

const formModal = document.querySelector("#form-modal");

const newBookForm = document.querySelector("#new-book-form");
newBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const bookTile = e.target.querySelector("input#book-title").value;
  const bookAuthor = e.target.querySelector("input#book-author").value;
  const bookPages = e.target.querySelector("input#book-pages").value;
  const bookStatus = e.target.querySelector("input#book-read").checked;

  addBookToLibrary(bookTile, bookAuthor, bookPages, bookStatus);
  displayBooks();
  e.target.reset();
  formModal.style.display = "none";
});

const newBookBtn = document.querySelector("#new-book-btn");
newBookBtn.addEventListener("click", () => {
  formModal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target == formModal) {
    formModal.style.display = "none";
  }
});
