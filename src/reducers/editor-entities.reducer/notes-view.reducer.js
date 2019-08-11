import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import undoable, { includeAction, groupByActionTypes } from 'redux-undo';
import produce from 'immer';

import {
  findNoteIndexByProperties,
  swapNotes,
} from '../../helpers/notes.helpers';
import { swapObstacles } from '../../helpers/obstacles.helpers';

const initialState = {
  notes: [],
  obstacles: [],
};

const getItemType = item => {
  switch (item) {
    case 'red-block':
      return 0;
    case 'blue-block':
      return 1;
    case 'mine':
      return 3;
    default: {
      throw new Error('Unrecognized item: ' + item);
    }
  }
};

const notes = (state = initialState.notes, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'CLEAR_ENTITIES': {
      // Reset the notes array when creating a new song
      return [];
    }

    case 'LOAD_BEATMAP_ENTITIES': {
      return action.notes || [];
    }

    case 'CLICK_PLACEMENT_GRID': {
      const {
        rowIndex,
        colIndex,
        cursorPositionInBeats,
        selectedDirection,
        selectedTool,
      } = action;

      // Make sure there isn't already a note in this location.
      const alreadyExists = state.some(
        note =>
          note._time === cursorPositionInBeats &&
          note._lineIndex === colIndex &&
          note._lineLayer === rowIndex
      );

      if (alreadyExists) {
        console.warn('Tried to add a double-note in the same spot. Rejected.');
        return state;
      }

      return [
        ...state,
        {
          _time: cursorPositionInBeats,
          _lineIndex: colIndex,
          _lineLayer: rowIndex,
          _type: getItemType(selectedTool),
          _cutDirection: selectedDirection,
        },
      ];
    }

    case 'SET_BLOCK_BY_DRAGGING': {
      // This action is very similar to `CLICK_PLACEMENT_GRID`, except the
      // direction is determined by the mouse position. Because of this, as the
      // user moves the mouse, the direction changes, and so the block needs
      // to be replaced. While in `CLICK_PLACEMENT_GRID` we ignore duplicate
      // blocks, in this case we need to swap it out.
      const {
        direction,
        rowIndex,
        colIndex,
        cursorPositionInBeats,
        selectedTool,
      } = action;

      const existingBlockIndex = state.findIndex(
        note =>
          note._time === cursorPositionInBeats &&
          note._lineIndex === colIndex &&
          note._lineLayer === rowIndex
      );

      const newBlock = {
        _time: cursorPositionInBeats,
        _lineIndex: colIndex,
        _lineLayer: rowIndex,
        _type: getItemType(selectedTool),
        _cutDirection: direction,
      };

      if (existingBlockIndex === -1) {
        return [...state, newBlock];
      }

      return [
        ...state.slice(0, existingBlockIndex),
        newBlock,
        ...state.slice(existingBlockIndex + 1),
      ];
    }

    case 'DELETE_NOTE':
    case 'BULK_DELETE_NOTE': {
      const noteIndex = findNoteIndexByProperties(state, action);

      if (noteIndex === -1) {
        // This shouldn't be possible, but if it does somehow happen, it
        // shouldn't crash everything.
        return state;
      }

      return [...state.slice(0, noteIndex), ...state.slice(noteIndex + 1)];
    }

    case 'DELETE_SELECTED_NOTES':
    case 'CUT_SELECTED_NOTES': {
      return state.filter(note => !note.selected);
    }

    case 'PASTE_SELECTED_NOTES': {
      const { cursorPositionInBeats, notes } = action;

      /*
        The notes that I copied have their time (in beats) from the origin 0.00.
        It might look like:

        [
          { "_time": 34, "_type": 3, "_value": 7 },
          { "_time": 34, ...snip },
          { "_time": 39, ...snip },
          { "_time": 40, ...snip },
        ]

        We need to reset all of the _time values to be based from the current
        cursor position. If we're at beat #44, we need to shift them all forward
        by 10 beats.
      */
      if (notes.length === 0) {
        return;
      }

      const deltaBetweenPeriods = cursorPositionInBeats - notes[0]._time;

      const timeShiftedNotes = notes.map(note => ({
        ...note,
        // Don't auto-select newly-pasted notes, if their original is selected.
        selected: false,
        _time: note._time + deltaBetweenPeriods,
      }));

      return [...state, ...timeShiftedNotes];
    }

    case 'TOGGLE_NOTE_COLOR': {
      const noteIndex = findNoteIndexByProperties(state, action);

      const note = state[noteIndex];

      // If this is a mine, do nothing
      if (note._type > 1) {
        return state;
      }

      return [
        ...state.slice(0, noteIndex),
        {
          ...note,
          _type: note._type === 0 ? 1 : 0,
        },
        ...state.slice(noteIndex + 1),
      ];
    }

    case 'SELECT_NOTE':
    case 'DESELECT_NOTE': {
      const noteIndex = findNoteIndexByProperties(state, action);

      const selected = action.type === 'SELECT_NOTE';

      if (noteIndex === -1) {
        // This shouldn't be possible, but if it does somehow happen, it
        // shouldn't crash everything.
        return state;
      }

      const note = state[noteIndex];

      return [
        ...state.slice(0, noteIndex),
        {
          ...note,
          selected,
        },
        ...state.slice(noteIndex + 1),
      ];
    }

    case 'SELECT_ALL': {
      return state.map(note => ({
        ...note,
        selected: true,
      }));
    }
    case 'DESELECT_ALL': {
      return state.map(note => ({
        ...note,
        selected: false,
      }));
    }

    case 'SWAP_SELECTED_NOTES': {
      const { axis } = action;
      return swapNotes(axis, state);
    }

    default:
      return state;
  }
};

const obstacles = (state = initialState.obstacles, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'CLEAR_ENTITIES': {
      return [];
    }

    case 'LOAD_BEATMAP_ENTITIES': {
      return action.obstacles || [];
    }

    case 'CREATE_NEW_OBSTACLE': {
      const { obstacle } = action;

      return [...state, obstacle];
    }

    case 'RESIZE_OBSTACLE': {
      const { id, newBeatDuration } = action;

      const obstacleIndex = state.findIndex(o => o.id === id);

      return produce(state, draftState => {
        const obstacle = draftState[obstacleIndex];
        obstacle.beatDuration = newBeatDuration;
      });
    }

    case 'DELETE_OBSTACLE': {
      return state.filter(obstacle => obstacle.id !== action.id);
    }

    case 'DELETE_SELECTED_NOTES':
    case 'CUT_SELECTED_NOTES': {
      return state.filter(obstacle => !obstacle.selected);
    }

    case 'SELECT_OBSTACLE': {
      const { id } = action;
      const obstacleIndex = state.findIndex(o => o.id === id);

      return produce(state, draftState => {
        draftState[obstacleIndex].selected = true;
      });
    }
    case 'DESELECT_OBSTACLE': {
      const { id } = action;
      const obstacleIndex = state.findIndex(o => o.id === id);

      return produce(state, draftState => {
        draftState[obstacleIndex].selected = false;
      });
    }

    case 'SWAP_SELECTED_NOTES': {
      const { axis } = action;
      return swapObstacles(axis, state);
    }

    default:
      return state;
  }
};

const notesView = undoable(combineReducers({ notes, obstacles }), {
  limit: 100,
  undoType: 'UNDO_NOTES',
  redoType: 'REDO_NOTES',
  filter: includeAction([
    'FINISH_LOADING_SONG',
    'CLICK_PLACEMENT_GRID',
    'SET_BLOCK_BY_DRAGGING',
    'DELETE_NOTE',
    'BULK_DELETE_NOTE',
    'DELETE_SELECTED_NOTES',
    'CUT_SELECTED_NOTES',
    'PASTE_SELECTED_NOTES',
    'CREATE_NEW_OBSTACLE',
    'RESIZE_OBSTACLE',
    'DELETE_OBSTACLE',
    'SWAP_SELECTED_NOTES',
  ]),
  groupBy: groupByActionTypes(['SET_BLOCK_BY_DRAGGING', 'BULK_DELETE_NOTE']),
});

//
//
// Selectors
//

export const getNotes = state => state.editorEntities.notesView.present.notes;
export const getEvents = state => [];
export const getObstacles = state =>
  state.editorEntities.notesView.present.obstacles;

export const getSelectedNotes = createSelector(
  getNotes,
  notes => {
    return notes.filter(note => note.selected);
  }
);
export const getSelectedObstacles = createSelector(
  getObstacles,
  obstacles => {
    return obstacles.filter(obstacle => obstacle.selected);
  }
);

export const getSelectedNotesAndObstacles = createSelector(
  getSelectedNotes,
  getSelectedObstacles,
  (notes, obstacles) => [...notes, ...obstacles]
);

export const getNumOfBlocks = createSelector(
  getNotes,
  notes => {
    return notes.filter(note => note._type === 0 || note._type === 1).length;
  }
);
export const getNumOfMines = createSelector(
  getNotes,
  notes => {
    return notes.filter(note => note._type === 3).length;
  }
);
export const getNumOfObstacles = state => getObstacles(state).length;

export const getNumOfSelectedNotes = state => {
  return getSelectedNotes(state).length + getSelectedObstacles(state).length;
};

export default notesView;
