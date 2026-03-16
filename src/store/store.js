import { createStore } from "redux";

export const BOOK_ADD = "BOOK_ADD";
export const BOOK_REMOVE = "BOOK_REMOVE";
export const BOOK_UPDATE_INFO = "BOOK_UPDATE_INFO";
export const BOOK_TOGGLE_AVAILABILITY = "BOOK_TOGGLE_AVAILABILITY";

export const READER_ADD = "READER_ADD";
export const READER_REMOVE = "READER_REMOVE";
export const BOOK_LEND_TO_READER = "BOOK_LEND_TO_READER";
export const BOOK_RETURN_FROM_READER = "BOOK_RETURN_FROM_READER";

const initialState = {
  books: [],
  readers: [],
  statistics: {
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    booksByDecade: {},
    activeReadersCount: 0,
    mostPopularAuthor: {
      name: "",
      booksCount: 0,
    },
    consistencyCheck: true,
  },
  lastUpdated: null,
};

function getDecade(year) {
  return String(Math.floor(Number(year) / 10) * 10);
}

function calculateStatistics(books, readers) {
  const totalBooks = books.length;
  const availableBooks = books.filter((book) => book.isAvailable).length;
  const borrowedBooks = books.filter((book) => !book.isAvailable).length;

  const booksByDecade = books.reduce((acc, book) => {
    const decade = getDecade(book.year);
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const activeReadersCount = readers.filter(
    (reader) => reader.borrowedBooks.length > 0,
  ).length;

  const authorsMap = books.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1;
    return acc;
  }, {});

  let mostPopularAuthor = {
    name: "",
    booksCount: 0,
  };

  for (const [author, booksCount] of Object.entries(authorsMap)) {
    if (booksCount > mostPopularAuthor.booksCount) {
      mostPopularAuthor = {
        name: author,
        booksCount,
      };
    }
  }

  const borrowedBooksByReaders = readers.reduce(
    (sum, reader) => sum + reader.borrowedBooks.length,
    0,
  );

  const consistencyCheck =
    availableBooks + borrowedBooks === totalBooks &&
    borrowedBooksByReaders === borrowedBooks;

  if (!consistencyCheck) {
    console.warn("Ошибка консистентности библиотеки");
  }

  return {
    totalBooks,
    availableBooks,
    borrowedBooks,
    booksByDecade,
    activeReadersCount,
    mostPopularAuthor,
    consistencyCheck,
  };
}

function buildState(state, books, readers) {
  return {
    ...state,
    books,
    readers,
    statistics: calculateStatistics(books, readers),
    lastUpdated: new Date().toISOString(),
  };
}

function libraryReducer(state = initialState, action) {
  switch (action.type) {
    case BOOK_ADD: {
      const { title, author, year } = action.payload;

      const newBook = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title,
        author,
        year,
        isAvailable: true,
      };

      return buildState(state, [...state.books, newBook], state.readers);
    }

    case BOOK_REMOVE: {
      const bookToRemove = state.books.find(
        (book) => book.id === action.payload,
      );

      if (!bookToRemove) {
        return state;
      }

      if (bookToRemove.isAvailable === false) {
        console.log("Нельзя удалить книгу, потому что она сейчас выдана");
        return state;
      }

      return buildState(
        state,
        state.books.filter((book) => book.id !== action.payload),
        state.readers,
      );
    }

    case BOOK_UPDATE_INFO: {
      const { id, title, author, year } = action.payload;

      return buildState(
        state,
        state.books.map((book) =>
          book.id === id
            ? {
                ...book,
                title: title ?? book.title,
                author: author ?? book.author,
                year: year ?? book.year,
              }
            : book,
        ),
        state.readers,
      );
    }

    case BOOK_TOGGLE_AVAILABILITY: {
      return buildState(
        state,
        state.books.map((book) =>
          book.id === action.payload
            ? { ...book, isAvailable: !book.isAvailable }
            : book,
        ),
        state.readers,
      );
    }

    case READER_ADD: {
      const { name, email } = action.payload;

      const newReader = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        email,
        borrowedBooks: [],
      };

      return buildState(state, state.books, [...state.readers, newReader]);
    }

    case READER_REMOVE: {
      const readerToRemove = state.readers.find(
        (reader) => reader.id === action.payload,
      );

      if (!readerToRemove) {
        return state;
      }

      if (readerToRemove.borrowedBooks.length > 0) {
        console.log("Нельзя удалить читателя, пока у него есть книги");
        return state;
      }

      return buildState(
        state,
        state.books,
        state.readers.filter((reader) => reader.id !== action.payload),
      );
    }

    case BOOK_LEND_TO_READER: {
      const { bookId, readerId } = action.payload;

      const book = state.books.find((item) => item.id === bookId);
      const reader = state.readers.find((item) => item.id === readerId);

      if (!book) {
        console.log("Книга не найдена");
        return state;
      }

      if (!reader) {
        console.log("Читатель не найден");
        return state;
      }

      if (!book.isAvailable) {
        console.log("Книга уже выдана");
        return state;
      }

      const nextBooks = state.books.map((item) =>
        item.id === bookId ? { ...item, isAvailable: false } : item,
      );

      const nextReaders = state.readers.map((item) =>
        item.id === readerId
          ? {
              ...item,
              borrowedBooks: [...item.borrowedBooks, bookId],
            }
          : item,
      );

      return buildState(state, nextBooks, nextReaders);
    }

    case BOOK_RETURN_FROM_READER: {
      const { bookId, readerId } = action.payload;

      const reader = state.readers.find((item) => item.id === readerId);

      if (!reader) {
        console.log("Читатель не найден");
        return state;
      }

      if (!reader.borrowedBooks.includes(bookId)) {
        console.log("У этого читателя нет такой книги");
        return state;
      }

      const nextBooks = state.books.map((item) =>
        item.id === bookId ? { ...item, isAvailable: true } : item,
      );

      const nextReaders = state.readers.map((item) =>
        item.id === readerId
          ? {
              ...item,
              borrowedBooks: item.borrowedBooks.filter((id) => id !== bookId),
            }
          : item,
      );

      return buildState(state, nextBooks, nextReaders);
    }

    default:
      return state;
  }
}

const store = createStore(libraryReducer);

export default store;
