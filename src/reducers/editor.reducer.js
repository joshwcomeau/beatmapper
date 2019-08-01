/**
 * This reducer holds transient state for the editor.
 * It can be thrown away with no worries.
 */
import { combineReducers } from 'redux';

const NOTE_TOOLS = ['red-block', 'blue-block', 'mine', 'obstacle'];

// eslint-disable-next-line no-unused-vars
const EVENT_TOOLS = [];

const initialState = {
  // `notes` covers everything in the /notes editor view:
  // blocks, mines, obstacles
  notes: {
    selectedTool: NOTE_TOOLS[0],
    selectedDirection: 8,
    selectionMode: null, // null | 'select' | 'deselect' | 'delete'.
  },
  events: {},
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

    case 'SELECT_PLACEMENT_TOOL': {
      const { tool } = action;
      return {
        ...state,
        selectedTool: tool,
      };
    }

    case 'SELECT_NEXT_TOOL':
    case 'SELECT_PREVIOUS_TOOL': {
      const { view } = action;

      if (view !== 'notes') {
        return;
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
  return state;
}

export default combineReducers({ notes, events });
