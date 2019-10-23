import { createSelector } from 'reselect';
const initialState = {};

export default function bookmarksReducer(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_BOOKMARK': {
      return {
        ...state,
        [action.beatNum]: {
          beatNum: action.beatNum,
          name: action.name,
          color: action.color,
        },
      };
    }

    default:
      return state;
  }
}

export const getBookmarks = state => state.bookmarks;
export const getSortedBookmarksArray = createSelector(
  getBookmarks,
  bookmarks => {
    let bookmarksArray = Object.values(bookmarks);
    return bookmarksArray.sort((a, b) => a.beatNum - b.beatNum);
  }
);
