import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import undoable, { includeAction, groupByActionTypes } from 'redux-undo';
import produce from 'immer';

import { NOTES_VIEW, SURFACE_DEPTHS } from '../../constants';
import {
  findNoteIndexByProperties,
  swapNotes,
  nudgeNotes,
  calculateNoteDensity,
} from '../../helpers/notes.helpers';
import { swapObstacles, nudgeObstacles } from '../../helpers/obstacles.helpers';
import { calculateVisibleRange } from '../../helpers/editor.helpers';
import { getCursorPositionInBeats, getBeatDepth } from '../navigation.reducer';
import { getSelectedSong } from '../songs.reducer';
import { getGraphicsLevel } from '../user.reducer';

const initialState = {
  notes: [],
  obstacles: [],
};

const getItemType = item => {
  switch (item) {
    case 'left-block':
    case 'red-block': // Legacy value
      return 0;
    case 'right-block':
    case 'blue-block': // Legacy value
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
    case 'START_LOADING_SONG':
    case 'LEAVE_EDITOR': {
      return initialState.notes;
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

    case 'CLEAR_CELL_OF_NOTES': {
      const { rowIndex, colIndex, cursorPositionInBeats } = action;

      const matchedNoteIndex = state.findIndex(block => {
        return (
          block._lineIndex === colIndex &&
          block._lineLayer === rowIndex &&
          block._time === cursorPositionInBeats
        );
      });

      if (matchedNoteIndex === -1) {
        return state;
      }

      return [
        ...state.slice(0, matchedNoteIndex),
        ...state.slice(matchedNoteIndex + 1),
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

    case 'DELETE_SELECTED_NOTES': {
      return state.filter(note => !note.selected);
    }

    case 'CUT_SELECTION': {
      if (action.view !== NOTES_VIEW) {
        return state;
      }

      return state.filter(note => !note.selected);
    }

    case 'PASTE_SELECTION': {
      const { pasteAtBeat, view, data } = action;

      if (view !== NOTES_VIEW || data.length === 0) {
        return state;
      }

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

        Do the same thing for obstacles.
      */

      // The tricky thing here is that the clipboard contains intermingled
      // notes/mines and obstacles, and their data format is different.
      const isBlockOrMine = item => typeof item._cutDirection === 'number';

      const earliestBeat = isBlockOrMine(data[0])
        ? data[0]._time
        : data[0].beatStart;
      const deltaBetweenPeriods = pasteAtBeat - earliestBeat;

      // When pasting a selection, we want to DESELECT all other notes.
      // Otherwise, it's easy to forget that you have actively-selected notes
      // somewhere else in the project.
      const deselectedState = state.map(note => ({
        ...note,
        selected: false,
      }));

      const notes = data.filter(isBlockOrMine);

      const timeShiftedNotes = notes.map(note => ({
        ...note,
        selected: true,
        _time: note._time + deltaBetweenPeriods,
      }));

      return [...deselectedState, ...timeShiftedNotes];
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
      if (action.view !== NOTES_VIEW) {
        return state;
      }
      return state.map(note => ({
        ...note,
        selected: true,
      }));
    }
    case 'DESELECT_ALL': {
      if (action.view !== NOTES_VIEW) {
        return state;
      }
      return state.map(note => ({
        ...note,
        selected: false,
      }));
    }

    case 'SELECT_ALL_IN_RANGE': {
      const { start, end, view } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      return state.map(note => {
        const selected = note._time >= start && note._time < end;

        return {
          ...note,
          selected,
        };
      });
    }

    case 'SWAP_SELECTED_NOTES': {
      const { axis } = action;
      return swapNotes(axis, state);
    }

    case 'NUDGE_SELECTION': {
      const { view, direction, amount } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      return nudgeNotes(direction, amount, state);
    }

    case 'DESELECT_ALL_OF_TYPE': {
      const { itemType } = action;

      if (itemType === 'obstacle') {
        return state;
      }

      const typeMap = {
        '0': 'block',
        '1': 'block',
        '3': 'mine',
      };

      return state.map(note => {
        const matchesType = typeMap[note._type] === itemType;

        if (!matchesType || !note.selected) {
          return note;
        }

        return {
          ...note,
          selected: false,
        };
      });
    }

    default:
      return state;
  }
};

const obstacles = (state = initialState.obstacles, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'START_LOADING_SONG':
    case 'LEAVE_EDITOR': {
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

    case 'RESIZE_SELECTED_OBSTACLES': {
      const { newBeatDuration } = action;

      return produce(state, draftState => {
        draftState.forEach(obstacle => {
          if (obstacle.selected) {
            obstacle.beatDuration = newBeatDuration;
          }
        });
      });
    }

    case 'DELETE_OBSTACLE': {
      return state.filter(obstacle => obstacle.id !== action.id);
    }

    case 'DELETE_SELECTED_NOTES': {
      return state.filter(obstacle => !obstacle.selected);
    }

    case 'CUT_SELECTION': {
      if (action.view !== NOTES_VIEW) {
        return state;
      }

      return state.filter(obstacle => !obstacle.selected);
    }
    case 'PASTE_SELECTION': {
      const { pasteAtBeat, view, data } = action;

      if (view !== NOTES_VIEW || data.length === 0) {
        return state;
      }

      // See PASTE_SELECTION in the above notes reducer to understand what's
      // going on here.
      const isObstacle = item => typeof item._cutDirection === 'undefined';

      const earliestBeat = isObstacle(data[0])
        ? data[0].beatStart
        : data[0]._time;
      const deltaBetweenPeriods = pasteAtBeat - earliestBeat;

      // When pasting a selection, we want to DESELECT all other notes.
      // Otherwise, it's easy to forget that you have actively-selected notes
      // somewhere else in the project.
      const deselectedState = state.map(obstacle => ({
        ...obstacle,
        selected: false,
      }));
      const obstacles = data.filter(isObstacle);

      const timeShiftedObstacles = obstacles.map(obstacle => ({
        ...obstacle,
        selected: true,
        beatStart: obstacle.beatStart + deltaBetweenPeriods,
      }));

      return [...deselectedState, ...timeShiftedObstacles];
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

    case 'SELECT_ALL': {
      if (action.view !== NOTES_VIEW) {
        return state;
      }
      return state.map(obstacle => ({
        ...obstacle,
        selected: true,
      }));
    }
    case 'DESELECT_ALL': {
      if (action.view !== NOTES_VIEW) {
        return state;
      }
      return state.map(obstacle => ({
        ...obstacle,
        selected: false,
      }));
    }

    case 'SELECT_ALL_IN_RANGE': {
      const { start, end, view } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      return state.map(obstacle => {
        const selected =
          obstacle.beatStart >= start && obstacle.beatStart < end;

        return {
          ...obstacle,
          selected,
        };
      });
    }

    case 'SWAP_SELECTED_NOTES': {
      const { axis } = action;
      return swapObstacles(axis, state);
    }

    case 'NUDGE_SELECTION': {
      const { view, direction, amount } = action;

      if (view !== NOTES_VIEW) {
        return state;
      }

      return nudgeObstacles(direction, amount, state);
    }

    case 'TOGGLE_FAST_WALLS_FOR_SELECTED_OBSTACLES': {
      // This action should either set all walls to "fast", or all walls to
      // "slow" (normal), based on if a single selected map is fast already.
      const areAnySelectedWallsFast = state.some(
        obstacle => obstacle.selected && obstacle.fast
      );

      const shouldBeFast = !areAnySelectedWallsFast;

      return state.map(obstacle => {
        if (obstacle.selected) {
          return {
            ...obstacle,
            fast: shouldBeFast,
          };
        } else {
          return obstacle;
        }
      });
    }

    case 'DESELECT_ALL_OF_TYPE': {
      const { itemType } = action;

      if (itemType !== 'obstacle') {
        return state;
      }

      return state.map(obstacle => {
        if (!obstacle.selected) {
          return obstacle;
        }

        return {
          ...obstacle,
          selected: false,
        };
      });
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
    'CUT_SELECTION',
    'PASTE_SELECTION',
    'CREATE_NEW_OBSTACLE',
    'RESIZE_OBSTACLE',
    'RESIZE_SELECTED_OBSTACLES',
    'DELETE_OBSTACLE',
    'SWAP_SELECTED_NOTES',
    'TOGGLE_NOTE_COLOR',
    'NUDGE_SELECTION',
  ]),
  groupBy: groupByActionTypes(['BULK_DELETE_NOTE']),
});

//
//
// Selectors
//

export const getNotes = state => state.editorEntities.notesView.present.notes;
export const getObstacles = state =>
  state.editorEntities.notesView.present.obstacles;

// Get the past/future set of either notes or obstacles.
const createHistoryGetter = (set, entityType) => state => {
  try {
    const entities = state.editorEntities.notesView[set];

    const mostRecentSet = entities[entities.length - 1];

    return mostRecentSet[entityType];
  } catch (e) {
    return [];
  }
};

export const getPastNotes = createHistoryGetter('past', 'notes');
export const getFutureNotes = createHistoryGetter('future', 'notes');
export const getPastObstacles = createHistoryGetter('past', 'obstacles');
export const getFutureObstacles = createHistoryGetter('future', 'obstacles');

// Notes === blocks + mines
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
export const getSelectedBlocks = createSelector(
  getNotes,
  notes => {
    return notes.filter(note => note.selected && note._type < 2);
  }
);
export const getSelectedMines = createSelector(
  getNotes,
  notes => {
    return notes.filter(note => note.selected && note._type === 3);
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

export const getCanUndo = state => {
  return state.editorEntities.notesView.past.length > 0;
};
export const getCanRedo = state => {
  return state.editorEntities.notesView.future.length > 0;
};

export const getVisibleNotes = createSelector(
  getNotes,
  getCursorPositionInBeats,
  getBeatDepth,
  getGraphicsLevel,
  (notes, cursorPositionInBeats, beatDepth, graphicsLevel) => {
    const [closeLimit, farLimit] = calculateVisibleRange(
      cursorPositionInBeats,
      beatDepth,
      graphicsLevel,
      { includeSpaceBeforeGrid: true }
    );

    return notes.filter(note => {
      return note._time > closeLimit && note._time < farLimit;
    });
  }
);

export const getVisibleObstacles = createSelector(
  getObstacles,
  getCursorPositionInBeats,
  getBeatDepth,
  getGraphicsLevel,
  (obstacles, cursorPositionInBeats, beatDepth, graphicsLevel) => {
    const [closeLimit, farLimit] = calculateVisibleRange(
      cursorPositionInBeats,
      beatDepth,
      graphicsLevel,
      { includeSpaceBeforeGrid: true }
    );

    return obstacles.filter(obstacle => {
      const beatEnd = obstacle.beatStart + obstacle.beatDuration;

      return beatEnd > closeLimit && obstacle.beatStart < farLimit;
    });
  }
);

export const getNoteDensity = createSelector(
  getVisibleNotes,
  getBeatDepth,
  getSelectedSong,
  getGraphicsLevel,
  (notes, beatDepth, song, graphicsLevel) => {
    const surfaceDepth = SURFACE_DEPTHS[graphicsLevel];

    const { bpm } = song;
    const segmentLengthInBeats = (surfaceDepth / beatDepth) * 1.2;

    return calculateNoteDensity(notes.length, segmentLengthInBeats, bpm);
  }
);

export default notesView;
