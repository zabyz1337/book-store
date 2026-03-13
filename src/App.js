import { useEffect } from "react";
import { useStore } from "react-redux";
import {
  BOOK_ADD,
  BOOK_REMOVE,
  BOOK_UPDATE_INFO,
  BOOK_TOGGLE_AVAILABILITY,
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

    const state = store.getState();
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

    return () => unsubscribe();
  }, [store]);

  return (
    <div>
      <h1>Library Redux</h1>
      <p>Открой консоль браузера, чтобы посмотреть изменения store.</p>
    </div>
  );
}

export default App;
