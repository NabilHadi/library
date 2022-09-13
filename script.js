let myLibrary = [];

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
  const rows = myLibrary.map(({ title, author, pages, isRead }, index) => {
    const tableRow = document.createElement("tr");
    tableRow.dataset.index = index;
    for (const key of [title, author, pages]) {
      const tableCell = document.createElement("td");
      tableCell.textContent = key;
      tableRow.append(tableCell);
    }
    const readStatusCell = document.createElement("td");
    readStatusCell.textContent = isRead ? "Read" : "Not Read";
    tableRow.append(readStatusCell);
    return tableRow;
  });
  const tableBody = document.querySelector(".books-table tbody");
  tableBody.append(...rows);
}

addBookToLibrary(
  "The Principles of Object-Oriented JavaScript",
  "Nicholas C. Zakas",
  120,
  false
);
addBookToLibrary("You Don't Know JS Yet", "Kyle Simpson", 200, true);

displayBooks();
