/**
 * I use redux-undo to manage undo/redo stuff, but this comes with one
 * limitation: I want to scroll the user to the right place, when
 * undoing/redoing.
 *
 * This middleware listens for undo events, and handles updating the
 * cursor position in response to these actions.
 */

import { jumpToBeat } from '../actions';
import {
  getNotes,
  getPastNotes,
  getFutureNotes,
} from '../reducers/editor-entities.reducer/notes-view.reducer';

const jumpToEarliestNote = (earlierNotes, laterNotes, dispatch) => {
  const notesAboutToBeAdded = earlierNotes.filter(note => {
    return !laterNotes.find(laterNote => {
      return note === laterNote;
    });
  });
  const notesAboutToBeRemoved = laterNotes.filter(note => {
    // return !earlierNotes.includes(note);
    return !earlierNotes.find(earlierNote => {
      return note === earlierNote;
    });
  });

  // This _should_ be impossible; undoing/redoing notes should always
  // either add or remove notes - but I can imagine this
  // changing. No error needed, since this just means the middleware
  // does nothing.
  if (notesAboutToBeAdded.length === 0 && notesAboutToBeRemoved.length === 0) {
    return;
  }

  console.log(notesAboutToBeAdded, notesAboutToBeRemoved);

  const relevantNotes =
    notesAboutToBeAdded.length > 0
      ? notesAboutToBeAdded
      : notesAboutToBeRemoved;

  // For now, assume that the first beat is the earliest.
  // Might make sense to sort them, so that if I delete a selected
  // cluster it brings me to the start of that cluster?
  const earliestNote = relevantNotes[0];

  dispatch(jumpToBeat(earliestNote._time, true, true));
};

export default function createHistoryMiddleware() {
  return store => next => action => {
    switch (action.type) {
      case 'UNDO_NOTES': {
        const state = store.getState();

        const pastNotes = getPastNotes(state);
        const presentNotes = getNotes(state);

        jumpToEarliestNote(pastNotes, presentNotes, store.dispatch);

        // Never interrupt the default action
        next(action);

        break;
      }

      case 'REDO_NOTES': {
        const state = store.getState();

        const presentNotes = getNotes(state);
        const futureNotes = getFutureNotes(state);

        jumpToEarliestNote(presentNotes, futureNotes, store.dispatch);

        // Never interrupt the default action
        next(action);

        break;
      }

      default:
        return next(action);
    }
  };
}
