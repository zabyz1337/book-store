import { useEffect } from "react";
import { useStore } from "react-redux";
import {
  BOOK_ADD,
  BOOK_REMOVE,
  BOOK_UPDATE_INFO,
  BOOK_TOGGLE_AVAILABILITY,
  READER_ADD,
  READER_REMOVE,
  BOOK_LEND_TO_READER,
  BOOK_RETURN_FROM_READER,
} from "./store/store";

function App() {
  const store = useStore();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      console.log("Новое состояние:", store.getState());
    });

    store.dispatch({
      type: BOOK_ADD,
      payload: {
        title: "Гарри Поттер",
        author: "Дж. Ролинг",
        year: 1967,
      },
    });

    store.dispatch({
      type: BOOK_ADD,
      payload: {
        title: "1984",
        author: "Оруэлл",
        year: 1949,
      },
    });

    let state = store.getState();
    const firstBookId = state.books[0].id;
    const secondBookId = state.books[1].id;

    store.dispatch({
      type: BOOK_REMOVE,
      payload: firstBookId,
    });

    store.dispatch({
      type: BOOK_UPDATE_INFO,
      payload: {
        id: secondBookId,
        year: 1948,
      },
    });

    store.dispatch({
      type: BOOK_TOGGLE_AVAILABILITY,
      payload: secondBookId,
    });

    store.dispatch({
      type: BOOK_TOGGLE_AVAILABILITY,
      payload: secondBookId,
    });

    store.dispatch({
      type: READER_ADD,
      payload: {
        name: "Иван Петров",
        email: "ivan@mail.com",
      },
    });

    store.dispatch({
      type: READER_ADD,
      payload: {
        name: "Анна Смирнова",
        email: "anna@mail.com",
      },
    });

    state = store.getState();

    const ivanId = state.readers.find(
      (reader) => reader.email === "ivan@mail.com",
    )?.id;

    const annaId = state.readers.find(
      (reader) => reader.email === "anna@mail.com",
    )?.id;

    const book1984Id = state.books.find((book) => book.title === "1984")?.id;

    store.dispatch({
      type: BOOK_LEND_TO_READER,
      payload: {
        bookId: book1984Id,
        readerId: ivanId,
      },
    });

    store.dispatch({
      type: BOOK_LEND_TO_READER,
      payload: {
        bookId: book1984Id,
        readerId: annaId,
      },
    });

    store.dispatch({
      type: BOOK_RETURN_FROM_READER,
      payload: {
        bookId: book1984Id,
        readerId: ivanId,
      },
    });

    store.dispatch({
      type: BOOK_LEND_TO_READER,
      payload: {
        bookId: book1984Id,
        readerId: annaId,
      },
    });

    store.dispatch({
      type: READER_REMOVE,
      payload: annaId,
    });

    return () => unsubscribe();
  }, [store]);

  const state = store.getState();

  return (
    <div>
      <h1>Library Redux</h1>
      <h2>Books</h2>
      <pre>{JSON.stringify(state.books, null, 2)}</pre>
      <h2>Readers</h2>
      <pre>{JSON.stringify(state.readers, null, 2)}</pre>
      <h2>Statistics</h2>
      <pre>{JSON.stringify(state.statistics, null, 2)}</pre>
    </div>
  );
}

export default App;
