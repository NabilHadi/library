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
    removeBookFromLibrary(bookIndex) {
      if (typeof bookIndex !== "number") bookIndex = Number(bookIndex);
      if (bookIndex < 0 || bookIndex >= books.length) return;

      const removedBook = books.splice(bookIndex, 1);

      PubSub.publish("BookRemoved", books, removedBook, bookIndex);
    },
    changeBookReadStatus(bookIndex, status = false) {
      if (typeof bookIndex !== "number") bookIndex = Number(bookIndex);
      if (bookIndex < 0 || bookIndex >= books.length) return;

      books[bookIndex].isRead = status;

      PubSub.publish("BookStatusChanged", bookIndex);
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
  modal.setContent([newBookForm]);
  newBookForm.addEventListener("submit", handleFormSubmit);

  const newBookButton = document.querySelector("#new_book_button");
  newBookButton.addEventListener("click", () => {
    modal.showModal();
  });
})();

const BookList = (function () {
  function handleDeleteBtnClick(event) {
    const index = event.target.dataset.index;
    if (!index) return;

    PubSub.publish("removeBookFromLibrary", index);
  }

  function handleToggleReadBtnClick(event) {
    const index = event.target.dataset.index;
    if (!index) return;

    PubSub.publish(
      "changeBookReadStatus",
      index,
      !Library.getBooks()[index].isRead
    );
  }

  function createCard(book, index) {
    const card = createElement({ classNames: ["card"], dataset: { index } });
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

    const deleteBookBtn = createElement({
      tag: "button",
      classNames: ["btn", "delete-book-btn"],
      textContent: "Delete",
      eventHandlers: {
        click: handleDeleteBtnClick,
      },
      dataset: { index },
    });

    const toggleReadStatusBtn = createElement({
      tag: "button",
      classNames: ["btn", "read-status-btn"],
      textContent: "Change Read Status",
      eventHandlers: {
        click: handleToggleReadBtnClick,
      },
      dataset: { index },
    });

    card.append(
      titleDiv,
      authorDiv,
      pagesDiv,
      isReadDiv,
      deleteBookBtn,
      toggleReadStatusBtn
    );
    return card;
  }

  const bookUL = document.querySelector(".books-list");

  function displayBooks(books) {
    bookUL.innerHTML = "";
    const booksLis = books.map((book, index) => {
      const li = document.createElement("li");
      li.append(createCard(book, index));
      return li;
    });

    bookUL.append(...booksLis);
  }

  function updateBook(bookIndex) {
    const bookObj = Library.getBooks()[bookIndex];
    const bookCard = bookUL.querySelector(`.card[data-index="${bookIndex}"`);
    if (!bookCard) return;
    bookCard.querySelector(".book-title").textContent = bookObj.title;
    bookCard.querySelector(".book-author").textContent = bookObj.author;
    bookCard.querySelector(".book-pages").textContent = bookObj.pages;
    bookCard.querySelector(".book-isRead").textContent = bookObj.isRead
      ? "Read"
      : "Not read";
  }

  PubSub.subscribe("BookAdded", displayBooks);
  PubSub.subscribe("BookRemoved", displayBooks);
  PubSub.subscribe("BookStatusChanged", updateBook);
  displayBooks(Library.getBooks());
})();

PubSub.subscribe("addBookToLibrary", Library.addBookToLibrary);
PubSub.subscribe("removeBookFromLibrary", Library.removeBookFromLibrary);
PubSub.subscribe("changeBookReadStatus", Library.changeBookReadStatus);
