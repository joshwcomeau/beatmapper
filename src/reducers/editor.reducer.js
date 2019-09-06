/**
 * This reducer holds transient state for the editor.
 * It's persisted for quality-of-life, but really it can be thrown away without
 * much user pain (unless it's every time)
 */
import { combineReducers } from 'redux';

import { NOTES_VIEW, EVENTS_VIEW, BEATS_PER_ZOOM_LEVEL } from '../constants';
import { floorToNearest } from '../utils';
import { getCursorPositionInBeats } from './navigation.reducer';

const NOTE_TOOLS = ['red-block', 'blue-block', 'mine', 'obstacle'];

const EVENT_TOOLS = ['on', 'off', 'flash', 'fade'];

const EVENT_EDIT_MODES = ['place', 'select'];

const EVENT_COLORS = ['red', 'blue'];

const initialState = {
  // `notes` covers everything in the /notes editor view:
  // blocks, mines, obstacles
  notes: {
    selectedTool: NOTE_TOOLS[0],
    selectedDirection: 8,
    selectionMode: null, // null | 'select' | 'deselect' | 'delete'.
  },
  events: {
    zoomLevel: 2,
    selectedEditMode: EVENT_EDIT_MODES[0],
    selectedBeat: null,
    selectedTool: EVENT_TOOLS[0],
    selectedColor: EVENT_COLORS[0],
    selectionBox: null,
  },
};

function notes(state = initialState.notes, action) {
  switch (action.type) {
    case 'SELECT_NOTE_DIRECTION': {
      const { direction } = action;
      return {
        ...state,
        selectedDirection: direction,
      };
    }

    case 'SELECT_TOOL': {
      const { view, tool } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      return {
        ...state,
        selectedTool: tool,
      };
    }

    case 'SELECT_NEXT_TOOL':
    case 'SELECT_PREVIOUS_TOOL': {
      const { view } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      const currentlySelectedTool = state.selectedTool;

      const incrementBy = action.type === 'SELECT_NEXT_TOOL' ? +1 : -1;

      const currentToolIndex = NOTE_TOOLS.indexOf(currentlySelectedTool);
      const nextTool =
        NOTE_TOOLS[
          (currentToolIndex + NOTE_TOOLS.length + incrementBy) %
            NOTE_TOOLS.length
        ];

      return {
        ...state,
        selectedTool: nextTool,
      };
    }

    case 'START_MANAGING_NOTE_SELECTION': {
      return {
        ...state,
        selectionMode: action.selectionMode,
      };
    }
    case 'FINISH_MANAGING_NOTE_SELECTION': {
      return {
        ...state,
        selectionMode: null,
      };
    }

    default:
      return state;
  }
}

function events(state = initialState.events, action) {
  switch (action.type) {
    case 'MOVE_MOUSE_ACROSS_EVENTS_GRID': {
      return {
        ...state,
        selectedBeat: action.selectedBeat,
      };
    }

    case 'DRAW_SELECTION_BOX': {
      return {
        ...state,
        selectionBox: action.selectionBox,
      };
    }
    case 'CLEAR_SELECTION_BOX': {
      // Avoid a re-render if we already don't have a selectionBox
      if (!state.selectionBox) {
        return state;
      }

      return {
        ...state,
        selectionBox: null,
      };
    }

    case 'COMMIT_SELECTION': {
      return {
        ...state,
        selectionBox: null,
      };
    }

    case 'SELECT_EVENT_COLOR': {
      const { color } = action;

      return {
        ...state,
        selectedColor: color,
      };
    }

    case 'SELECT_TOOL': {
      const { view, tool } = action;

      if (view !== EVENTS_VIEW) {
        return state;
      }

      return {
        ...state,
        selectedTool: tool,
      };
    }

    case 'SELECT_NEXT_TOOL':
    case 'SELECT_PREVIOUS_TOOL': {
      const { view } = action;

      if (view !== EVENTS_VIEW) {
        return state;
      }

      const currentlySelectedTool = state.selectedTool;

      const incrementBy = action.type === 'SELECT_NEXT_TOOL' ? +1 : -1;

      const currentToolIndex = EVENT_TOOLS.indexOf(currentlySelectedTool);
      const nextTool =
        EVENT_TOOLS[
          (currentToolIndex + EVENT_TOOLS.length + incrementBy) %
            EVENT_TOOLS.length
        ];

      return {
        ...state,
        selectedTool: nextTool,
      };
    }

    case 'SELECT_EVENT_EDIT_MODE': {
      return {
        ...state,
        selectedEditMode: action.editMode,
      };
    }

    case 'START_MANAGING_EVENT_SELECTION': {
      return {
        ...state,
        selectionMode: action.selectionMode,
        selectionModeTrackId: action.trackId,
      };
    }
    case 'FINISH_MANAGING_EVENT_SELECTION': {
      return {
        ...state,
        selectionMode: null,
        selectionModeTrackId: null,
      };
    }

    case 'ZOOM_IN': {
      const newZoomLevel = Math.min(4, state.zoomLevel + 1);
      return {
        ...state,
        zoomLevel: newZoomLevel,
      };
    }

    case 'ZOOM_OUT': {
      const newZoomLevel = Math.max(1, state.zoomLevel - 1);
      return {
        ...state,
        zoomLevel: newZoomLevel,
      };
    }

    default:
      return state;
  }
}

export const getSelectedNoteTool = state => state.editor.notes.selectedTool;
export const getSelectedCutDirection = state =>
  state.editor.notes.selectedDirection;

export const getSelectedEventEditMode = state =>
  state.editor.events.selectedEditMode;
export const getSelectedEventTool = state => state.editor.events.selectedTool;
export const getSelectedEventColor = state => state.editor.events.selectedColor;
export const getZoomLevel = state => state.editor.events.zoomLevel;
export const getSelectionBox = state => state.editor.events.selectionBox;

export const getBeatsPerZoomLevel = state => {
  const zoomLevel = getZoomLevel(state);
  return BEATS_PER_ZOOM_LEVEL[zoomLevel];
};
export const getStartAndEndBeat = state => {
  const cursorPositionInBeats = getCursorPositionInBeats(state);
  const numOfBeatsToShow = getBeatsPerZoomLevel(state);

  const startBeat = floorToNearest(cursorPositionInBeats, numOfBeatsToShow);
  const endBeat = startBeat + numOfBeatsToShow;

  return { startBeat, endBeat };
};

export const getSelectedEventBeat = state => state.editor.events.selectedBeat;

export default combineReducers({ notes, events });
