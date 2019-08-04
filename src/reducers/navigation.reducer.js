import { SNAPPING_INCREMENTS } from '../constants';
import { convertMillisecondsToBeats } from '../helpers/audio.helpers';
import { getSelectedSong } from './songs.reducer';

const initialState = {
  isLoading: false,
  isPlaying: false,
  duration: null,
  snapTo: 1,
  cursorPosition: 0,
  animateBlockMotion: true,
  playbackRate: 1,
  volume: 0.75,
  playNoteTick: false,
};

export default function navigationReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_LOADING_SONG': {
      return {
        ...state,
        isLoading: true,
      };
    }

    case 'UNLOAD_SONG': {
      return {
        ...state,
        cursorPosition: 0,
      };
    }

    case 'FINISH_LOADING_SONG': {
      const { duration, song } = action;

      return {
        ...state,
        cursorPosition: song.offset,
        isLoading: false,
        duration: duration,
      };
    }

    case 'START_PLAYING': {
      return {
        ...state,
        isPlaying: true,
        animateBlockMotion: false,
      };
    }

    case 'PAUSE_PLAYING': {
      return {
        ...state,
        isPlaying: false,
        animateBlockMotion: true,
      };
    }

    case 'ADJUST_CURSOR_POSITION': {
      return {
        ...state,
        cursorPosition: action.newCursorPosition,
      };
    }

    case 'TICK': {
      return {
        ...state,
        cursorPosition: action.timeElapsed,
      };
    }

    case 'SCRUB_WAVEFORM': {
      return {
        ...state,
        cursorPosition: action.newOffset,
        animateBlockMotion: false,
      };
    }

    case 'JUMP_TO_BAR': {
      return {
        ...state,
        animateBlockMotion: false,
      };
    }

    case 'SCROLL_THROUGH_SONG': {
      // The actual cursor-position for this is done with an
      // `ADJUST_CURSOR_POSITION` dispatch.
      return {
        ...state,
        animateBlockMotion: true,
      };
    }

    case 'SKIP_TO_START': {
      return {
        ...state,
        animateBlockMotion: false,
        cursorPosition: action.offset,
      };
    }
    case 'SKIP_TO_END': {
      return {
        ...state,
        animateBlockMotion: false,
        cursorPosition: state.duration,
      };
    }

    case 'UPDATE_VOLUME': {
      return {
        ...state,
        volume: action.volume,
      };
    }

    case 'UPDATE_PLAYBACK_SPEED': {
      return {
        ...state,
        playbackRate: action.playbackRate,
      };
    }

    case 'CHANGE_SNAPPING': {
      return {
        ...state,
        snapTo: action.newSnapTo,
      };
    }

    case 'TOGGLE_NOTE_TICK': {
      return {
        ...state,
        playNoteTick: !state.playNoteTick,
      };
    }

    case 'INCREMENT_SNAPPING':
    case 'DECREMENT_SNAPPING': {
      let currentSnappingIncrementIndex = SNAPPING_INCREMENTS.findIndex(
        increment => increment.value === state.snapTo
      );

      // This shouldn't be possible, but if somehow we don't have a recognized
      // interval, just reset to 1.
      if (currentSnappingIncrementIndex === -1) {
        return {
          ...state,
          snapTo: 1,
        };
      }

      const nextSnappingIndex =
        action.type === 'INCREMENT_SNAPPING'
          ? currentSnappingIncrementIndex + 1
          : currentSnappingIncrementIndex - 1;
      const nextSnappingIncrement = SNAPPING_INCREMENTS[nextSnappingIndex];

      // If we're at one end of the scale and we try to push beyond it,
      // we'll hit an undefined. Do nothing in those cases (no wrapping around
      // desired).
      if (!nextSnappingIncrement) {
        return state;
      }

      return {
        ...state,
        snapTo: nextSnappingIncrement.value,
      };
    }

    case 'LEAVE_EDITOR': {
      return {
        ...state,
        cursorPosition: 0,
        isPlaying: false,
        duration: null,
      };
    }

    default:
      return state;
  }
}

export const getIsPlaying = state => state.navigation.isPlaying;
export const getIsLoading = state => state.navigation.isLoading;
export const getSnapTo = state => state.navigation.snapTo;

export const getCursorPositionInBeats = state => {
  const song = getSelectedSong(state);
  return convertMillisecondsToBeats(
    state.navigation.cursorPosition - song.offset,
    song.bpm
  );
};

export const getPlaybackRate = state => state.navigation.playbackRate;
export const getVolume = state => state.navigation.volume;
export const getPlayNoteTick = state => state.navigation.playNoteTick;
