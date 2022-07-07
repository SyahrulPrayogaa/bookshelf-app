/**
 * * implementasi local storage
 * Todo: berikan toast saat berhasil menambah atau menghapus data
 * TODO: buat pencarian data
 */

const storageKey = "BOOK_DATA";
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("submit-book");
  submitBook.addEventListener("click", function (event) {
    addBook();
    event.preventDefault();
  });

  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderBook();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putBookData(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function getBookData() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

function addBook() {
  const title = document.querySelector("#inputTitleBook").value;
  const author = document.querySelector("#inputAuthorBook").value;
  const year = document.querySelector("#inputYearBook").value;
  const isComplete = document.querySelector("#isComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isComplete
  );
  putBookData(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function showBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const isCompleteButton = document.createElement("button");
  isCompleteButton.classList.add("btn");
  if (bookObject.isComplete != true) {
    isCompleteButton.innerText = "Buku ini sudah dibaca";
  } else {
    isCompleteButton.innerText = "Buku ini belum dibaca";
  }

  const trashButton = document.createElement("button");
  trashButton.classList.add("btn");
  trashButton.style.cssText = "background-color: rgb(190, 5, 5)";
  trashButton.innerText = "hapus";

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("btn-group");
  buttonGroup.append(isCompleteButton, trashButton);

  isCompleteButton.addEventListener("click", function () {
    changeBookCompleted(bookObject.id);
  });

  trashButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  const container = document.createElement("div");
  container.classList.add("card-item");
  container.append(bookTitle, bookAuthor, bookYear, buttonGroup);
  container.setAttribute("id", `book-${bookObject.id}`);

  return container;
}

function renderBook() {
  bookData = getBookData();
  const uncompletedBook = document.getElementById("book-shelf-uncompleted");
  const completedBook = document.getElementById("book-shelf-completed");

  uncompletedBook.innerHTML = "";
  completedBook.innerHTML = "";

  for (const data of bookData) {
    const dataElement = showBook(data);
    if (data.isComplete != true) {
      uncompletedBook.append(dataElement);
    } else {
      completedBook.append(dataElement);
    }
  }
}

document.addEventListener(RENDER_EVENT, function () {
  renderBook();
});

function changeBookCompleted(bookId) {
  bookData = getBookData();
  const bookTarget = findBook(bookId);

  if (bookTarget.isComplete == true) {
    bookTarget.isComplete = false;
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  } else if (bookTarget.isComplete == false) {
    bookTarget.isComplete = true;
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  } else {
    return;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(bookId) {
  bookData = getBookData();
  const bookTarget = findBookIndex(bookId);
  if (bookTarget == -1) return;
  if (confirm("Apakah anda yakin?") == true) {
    bookData.splice(bookTarget, 1);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  } else {
    return;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  bookData = getBookData();
  for (const data of bookData) {
    if (data.id === bookId) {
      return data;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  bookData = getBookData();
  for (const index in bookData) {
    if (bookData[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

// const submitSearch = document.getElementById("submit-search");

// submitSearch.addEventListener("click", function () {
//   const inputSearch = document.querySelector("#input-search").value;
//   searchItem(inputSearch);
// });

// function searchItem(input) {
//   const query = () => {
//     return input;
//   };
//   console.log(bookData.filter(query));
//   // for (let i = 0; i < bookData.length; i++) {
//   //   if (bookData[i].title == input) {
//   //   }
//   // }

//   // document.dispatchEvent(new Event(RENDER_EVENT));
// }
