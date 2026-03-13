import { createStore } from "redux";

export const BOOK_ADD = "BOOK_ADD";
export const BOOK_REMOVE = "BOOK_REMOVE";
export const BOOK_UPDATE_INFO = "BOOK_UPDATE_INFO";
export const BOOK_TOGGLE_AVAILABILITY = "BOOK_TOGGLE_AVAILABILITY";

const initialState = {
  books: [],
  lastUpdated: null,
};

function libraryReducer(state = initialState, action) {
  switch (action.type) {
    case BOOK_ADD: {
      const { title, author, year } = action.payload;

      const newBook = {
        id: Date.now() + Math.random(),
        title,
        author,
        year,
        isAvailable: true,
      };

      return {
        ...state,
        books: [...state.books, newBook],
        lastUpdated: new Date().toISOString(),
      };
    }

    default:
      return state;
  }
}

const store = createStore(libraryReducer);

export default store;
