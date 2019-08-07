/**
 * This reducer manages all "live-editable" entities - notes, events, obstacles.
 *
 * It also dictates the metadata about what's being edited, like which
 * difficulty. This is important because when the user goes to download this
 * map (or, perhaps periodically in the future), I'll want to save this data to
 * indexeddb as a text file, and I need to know which difficulty we're editing.
 */
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import notesView from './notes-view.reducer';
import eventsView from './events-view.reducer';

const initialState = {
  difficulty: null,
  // Controlled by child reducers:
  notesView: {},
  eventsView: {},
};

const difficulty = (state = initialState.difficulty, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG': {
      return action.selectedDifficulty;
    }

    case 'START_LOADING_SONG': {
      return action.difficulty;
    }

    default:
      return state;
  }
};

export default combineReducers({ difficulty, notesView, eventsView });

//
//
// Selectors
// TODO: Move most of these to their respective child reducer file
//
export const getDifficulty = state => state.editorEntities.difficulty;
export const getNotes = state => state.editorEntities.notesView.present.notes;
export const getEvents = state => [];
export const getObstacles = state =>
  state.editorEntities.notesView.present.obstacles;

export const getSelectedNotes = state => {
  return getNotes(state).filter(note => note.selected);
};
export const getSelectedObstacles = state => {
  return getObstacles(state).filter(obstacle => obstacle.selected);
};

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
