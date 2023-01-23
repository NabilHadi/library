const PubSub = {
  events: [],
  subscribe(eventName, func) {
    if (this.events[eventName]) {
      this.events[eventName].push(func);
      console.log(`${func.name} has subscribed to ${eventName} Topic!`);
    } else {
      this.events[eventName] = [func];
      console.log(`${func.name} has subscribed to ${eventName} Topic!`);
    }
  },
  unsubscribe(eventName, func) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (fn) => fn !== func
      );
      console.log(`${func.name} has unsubscribed from ${eventName} Topic!`);
    }
  },
  publish(eventName, ...args) {
    const funcs = this.events[eventName];
    if (Array.isArray(funcs)) {
      funcs.forEach((func) => {
        func.apply(null, args);
      });
    }
  },
};

let myLibrary = [
  new Book("The Hobbit", "J.R.R.", 295, false),
  new Book("The not Hobbit", "not J.R.R.", 195, true),
  new Book("Hello", "World", 15, true),
];

function Book(title, author, pages, isRead = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(bookObj) {
  myLibrary.push(
    new Book(bookObj.title, bookObj.author, bookObj.pages, bookObj.isRead)
  );

  PubSub.publish("BookAdded", myLibrary);
}

function displayBooks(books) {
  const bookUL = document.querySelector(".books-list");
  bookUL.innerHTML = "";
  const booksLis = books.map((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} by ${book.author}, ${book.pages} pages, ${
      book.isRead ? "Read" : "Not read"
    }.`;
    return li;
  });

  bookUL.append(...booksLis);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  let bookObj = {};
  for (const [name, value] of formData) {
    if (name === "read") {
      bookObj.isRead = value === "on" ? true : false;
      continue;
    }
    bookObj[name] = value;
  }

  PubSub.publish("addBookToLibrary", bookObj);
}

const newBookForm = document.querySelector("#new_book_form");
newBookForm.addEventListener("submit", handleFormSubmit);

PubSub.subscribe("addBookToLibrary", addBookToLibrary);
PubSub.subscribe("BookAdded", displayBooks);

displayBooks(myLibrary);
