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

function createElement({
  tag = "div",
  classNames = [],
  textContent,
  dataset = {},
  attributes = {},
  eventHandlers = {},
} = {}) {
  // Create elm with tag
  const elm = document.createElement(tag);

  // Add classes
  classNames.forEach((className) => {
    elm.classList.add(className);
  });

  // Set textContent
  if (textContent) {
    elm.textContent = textContent;
  }

  // Set dataset
  for (const key in dataset) {
    elm.dataset[key] = dataset[key];
  }

  // Set Attribuites
  for (const key in attributes) {
    elm.setAttribute(key, attributes[key]);
  }

  // Set Handlers
  for (const key in eventHandlers) {
    elm.addEventListener(key, eventHandlers[key]);
  }

  return elm;
}

const modal = (function () {
  const view = createElement({
    tag: "div",
    classNames: ["modal"],
    attributes: { id: "modal" },
  });

  const modalContent = createElement({
    tag: "div",
    classNames: ["modal-content"],
    attributes: {
      id: "modal-content",
    },
  });
  view.append(modalContent);

  const closeBtn = createElement({
    tag: "span",
    classNames: ["close"],
    textContent: "×",
  });
  modalContent.append(closeBtn);

  closeBtn.addEventListener("click", () => {
    hideModal();
  });

  view.addEventListener(
    "click",
    (e) => {
      if (view !== e.target) return;
      hideModal();
    },
    false
  );

  document.querySelector(".container").appendChild(view);

  function setContent(content = []) {
    modalContent.innerHTML = "";
    modalContent.append(closeBtn);

    modalContent.append(...content);
  }

  function showModal() {
    view.classList.add("show");
  }

  function hideModal() {
    view.classList.remove("show");
  }

  function getView() {
    return view;
  }

  return { setContent, showModal, hideModal, getView };
})();

const Library = (function () {
  function Book(title, author, pages, isRead = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }

  let books = [
    new Book("The Hobbit", "J.R.R.", 295, false),
    new Book("The not Hobbit", "not J.R.R.", 195, true),
    new Book("Hello", "World", 15, true),
  ];

  return {
    addBookToLibrary(bookObj) {
      books.push(
        new Book(bookObj.title, bookObj.author, bookObj.pages, bookObj.isRead)
      );

      PubSub.publish("BookAdded", books);
    },
    getBooks() {
      return [...books];
    },
  };
})();

const BookForm = (function () {
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
})();

const BookList = (function () {
  function createCard(book) {
    const card = createElement({ classNames: ["card"] });
    const titleDiv = createElement({
      textContent: book.title,
      classNames: ["book-title"],
    });
    const authorDiv = createElement({
      textContent: book.author,
      classNames: ["book-author"],
    });
    const pagesDiv = createElement({
      textContent: book.pages,
      classNames: ["book-pages"],
    });
    const isReadDiv = createElement({
      textContent: book.isRead ? "Read" : "Not read",
      classNames: ["book-isRead"],
    });

    card.append(titleDiv, authorDiv, pagesDiv, isReadDiv);
    return card;
  }
  function displayBooks(books) {
    const bookUL = document.querySelector(".books-list");
    bookUL.innerHTML = "";
    const booksLis = books.map((book) => {
      const li = document.createElement("li");
      li.append(createCard(book));
      return li;
    });

    bookUL.append(...booksLis);
  }

  PubSub.subscribe("BookAdded", displayBooks);
  displayBooks(Library.getBooks());
})();

PubSub.subscribe("addBookToLibrary", Library.addBookToLibrary);
