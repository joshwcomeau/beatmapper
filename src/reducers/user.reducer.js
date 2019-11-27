/**
 * This reducer holds user/session-specific info.
 *
 * Persisted across sessions (like songs.reducer)
 */
import { createSelector } from 'reselect';
import { getIsPlaying } from './navigation.reducer';

const DEFAULT_PROCESSING_DELAY = 60;
const DEFAULT_GRAPHICS_LEVEL = 'high';

const initialState = {
  isNewUser: true,
  seenPrompts: [],
  stickyMapAuthorName: null,
  processingDelay: DEFAULT_PROCESSING_DELAY,
  graphicsLevel: DEFAULT_GRAPHICS_LEVEL,
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

    case 'UPDATE_PROCESSING_DELAY': {
      return {
        ...state,
        processingDelay: action.newDelay,
      };
    }

    case 'UPDATE_GRAPHICS_LEVEL': {
      return {
        ...state,
        graphicsLevel: action.newGraphicsLevel,
      };
    }

    default:
      return state;
  }
}

export const getIsNewUser = state => state.user.isNewUser;
export const getSeenPrompts = state => state.user.seenPrompts;
export const getStickyMapAuthorName = state => state.user.stickyMapAuthorName;
export const getProcessingDelay = state =>
  typeof state.user.processingDelay === 'number'
    ? state.user.processingDelay
    : DEFAULT_PROCESSING_DELAY;

export const getUsableProcessingDelay = createSelector(
  getProcessingDelay,
  getIsPlaying,
  (processingDelay, isPlaying) => {
    // If we're not playing the track, we shouldn't have any processing
    // delay. This is to prevent stuff from firing prematurely when
    // scrubbing.
    return isPlaying ? processingDelay : 0;
  }
);

export const getGraphicsLevel = state =>
  typeof state.user.graphicsLevel === 'string'
    ? state.user.graphicsLevel
    : DEFAULT_GRAPHICS_LEVEL;
