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
  return state;
}

const store = createStore(libraryReducer);

export default store;
