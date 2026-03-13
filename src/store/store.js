import { createStore } from "redux";

const initialState = {
  books: [],
  lastUpdated: null,
};

function libraryReducer(state = initialState, action) {
  return state;
}

const store = createStore(libraryReducer);

export default store;
