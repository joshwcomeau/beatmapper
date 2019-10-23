import { createSelector } from 'reselect';
import produce from 'immer';

const initialState = {};

export default function bookmarksReducer(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'START_LOADING_SONG':
    case 'LEAVE_EDITOR': {
      return initialState;
    }

    case 'LOAD_BEATMAP_ENTITIES': {
      // The initial data is loaded as an array, we need to convert it to a map.
      return action.bookmarks.reduce((acc, bookmark) => {
        return {
          ...acc,
          [bookmark.beatNum]: bookmark,
        };
      }, {});
    }

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

    case 'DELETE_BOOKMARK': {
      return produce(state, draftState => {
        delete draftState[action.beatNum];
      });
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
