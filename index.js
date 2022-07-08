/**
 * // todo: implementasi local storage
 * Todo: berikan toast saat berhasil menambah atau menghapus data
 * TODO: buat pencarian data
 */

const bookData = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SHELF";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("submit-book");
  submitBook.addEventListener("click", function (event) {
    addBook();
    event.preventDefault();
  });

  const submitSearch = document.getElementById("submit-search");
  submitSearch.addEventListener("click", function (event) {
    loadDataFromSearch();
    event.preventDefault();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.querySelector("#inputTitleBook").value;
  const author = document.querySelector("#inputAuthorBook").value;
  const year = document.querySelector("#inputYearBook").value;
  const isComplete = document.querySelector("#isComplete").checked;

  // if (title != "" && author != "" && year != "") {
  //   bookData.push(book);
  //   document.dispatchEvent(new Event(RENDER_EVENT));
  // } else {
  //   alert("Gagal Memasukkan Buku kedalam Rak buku");
  // }

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isComplete
  );
  bookData.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
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

document.addEventListener(RENDER_EVENT, function () {
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
});

function changeBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget.isComplete == true) {
    bookTarget.isComplete = false;
  } else if (bookTarget.isComplete == false) {
    bookTarget.isComplete = true;
  } else {
    return;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const data of bookData) {
    if (data.id === bookId) {
      return data;
    }
  }
  return null;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget == -1) return;
  if (confirm("Apakah anda yakin?") == true) {
    bookData.splice(bookTarget, 1);
  } else {
    return;
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in bookData) {
    if (bookData[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Maaf browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    let parsed = JSON.stringify(bookData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

function loadDataFromStorage() {
  const dataFromStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataFromStorage);

  if (data !== null) {
    for (const newData of data) {
      bookData.push(newData);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadDataFromSearch() {
  const inputSearch = document
    .getElementById("input-search")
    .value.toLowerCase();
  const dataFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (bookData !== null) {
    bookData.splice(0, bookData.length);
  }
  for (const data of dataFromStorage) {
    titleBook = data.title.toLowerCase();
    if (titleBook.includes(inputSearch)) {
      bookData.push(data);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
