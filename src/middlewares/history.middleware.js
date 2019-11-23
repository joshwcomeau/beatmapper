/**
 * I use redux-undo to manage undo/redo stuff, but this comes with one
 * limitation: I want to scroll the user to the right place, when
 * undoing/redoing.
 *
 * This middleware listens for undo events, and handles updating the
 * cursor position in response to these actions.
 */

import { jumpToBeat } from '../actions';
import { calculateVisibleRange } from '../helpers/editor.helpers';
import {
  getNotes,
  getPastNotes,
  getFutureNotes,
} from '../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../reducers/navigation.reducer';
import { getGraphicsLevel } from '../reducers/user.reducer';

const jumpToEarliestNote = (earlierNotes, laterNotes, store) => {
  const notesAboutToBeAdded = earlierNotes.filter(note => {
    return !laterNotes.find(laterNote => {
      return note === laterNote;
    });
  });
  const notesAboutToBeRemoved = laterNotes.filter(note => {
    return !earlierNotes.find(earlierNote => {
      return note === earlierNote;
    });
  });

  if (notesAboutToBeAdded.length === 0 && notesAboutToBeRemoved.length === 0) {
    return;
  }

  const relevantNotes =
    notesAboutToBeAdded.length > 0
      ? notesAboutToBeAdded
      : notesAboutToBeRemoved;

  // For now, assume that the first beat is the earliest.
  // Might make sense to sort them, so that if I delete a selected
  // cluster it brings me to the start of that cluster?
  const earliestNote = relevantNotes[0];

  // Is this note within our visible range? If not, jump to it.
  const state = store.getState();
  const cursorPositionInBeats = getCursorPositionInBeats(state);
  const beatDepth = getBeatDepth(state);
  const graphicsLevel = getGraphicsLevel(state);

  const [closeLimit, farLimit] = calculateVisibleRange(
    cursorPositionInBeats,
    beatDepth,
    graphicsLevel
  );

  const isNoteVisible =
    earliestNote._time > closeLimit && earliestNote._time < farLimit;

  if (!isNoteVisible) {
    store.dispatch(jumpToBeat(earliestNote._time, true, true));
  }
};

export default function createHistoryMiddleware() {
  return store => next => action => {
    switch (action.type) {
      case 'UNDO_NOTES': {
        const state = store.getState();

        const pastNotes = getPastNotes(state);
        const presentNotes = getNotes(state);

        if (!pastNotes.length) {
          // Nothing to undo!
          return;
        }

        jumpToEarliestNote(pastNotes, presentNotes, store);

        // Never interrupt the default action
        next(action);

        break;
      }

      case 'REDO_NOTES': {
        const state = store.getState();

        const presentNotes = getNotes(state);
        const futureNotes = getFutureNotes(state);

        if (!futureNotes.length) {
          // Nothing to redo!
          return;
        }

        jumpToEarliestNote(presentNotes, futureNotes, store);

        // Never interrupt the default action
        next(action);

        break;
      }

      default:
        return next(action);
    }
  };
}
