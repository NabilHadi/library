function Book(title, author, numOfPages, isRead) {
  this.title = title;
  this.author = author;
  this.numOfPages = numOfPages;
  this.isRead = isRead;
  this.info = function () {
    return `${title} by ${author}, ${numOfPages} pages, ${
      isRead ? "read" : "not read yet"
    }`;
  };
}
