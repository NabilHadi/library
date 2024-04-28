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
    tdRead.textContent = book.pages;
    tableRow.appendChild(tdRead);

    tableBody.appendChild(tableRow);
  });
}

addBookToLibrary("my title", "my Author", 123, false);
addBookToLibrary("my title 1", "my Author", 135, true);
addBookToLibrary("my title 2", "my Author 1", 153, false);
addBookToLibrary("my title 3", "my Author 2", 423, true);