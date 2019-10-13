/**
 * This reducer holds user/session-specific info.
 * For now, it only tracks whether or not we should treat this user as
 * brand-new or not.
 *
 * Persisted across sessions (like songs.reducer)
 */

const initialState = {
  isNewUser: true,
  seenPrompts: [],
  stickyMapAuthorName: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'IMPORT_EXISTING_SONG': {
      if (action.songData.demo) {
        return state;
      }

      return {
        ...state,
        isNewUser: false,
      };
    }

    case 'CREATE_NEW_SONG':
    case 'FINISH_LOADING_SONG': {
      return {
        ...state,
        isNewUser: false,
      };
    }

    case 'UPDATE_SONG_DETAILS': {
      return {
        ...state,
        stickyMapAuthorName: action.mapAuthorName,
      };
    }

    case 'DISMISS_PROMPT': {
      return {
        ...state,
        seenPrompts: [...state.seenPrompts, action.promptId],
      };
    }

    default:
      return state;
  }
}

export const getIsNewUser = state => state.user.isNewUser;
export const getSeenPrompts = state => state.user.seenPrompts;
export const getStickyMapAuthorName = state => state.user.stickyMapAuthorName;
