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
  getObstacles,
  getPastObstacles,
  getFutureObstacles,
} from '../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../reducers/navigation.reducer';
import { getGraphicsLevel } from '../reducers/user.reducer';

const jumpToEarliestNote = (
  earlierNotes,
  laterNotes,
  earlierObstacles,
  laterObstacles,
  store
) => {
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

  const obstaclesAboutToBeAdded = earlierObstacles.filter(obstacle => {
    return !laterObstacles.find(laterObstacle => {
      return obstacle === laterObstacle;
    });
  });
  const obstaclesAboutToBeRemoved = laterObstacles.filter(obstacle => {
    return !earlierObstacles.find(earlierObstacle => {
      return obstacle === earlierObstacle;
    });
  });

  const isTweakingNotes =
    notesAboutToBeAdded.length || notesAboutToBeRemoved.length;
  const isTweakingObstacles =
    obstaclesAboutToBeAdded.length || obstaclesAboutToBeRemoved.length;

  if (!isTweakingNotes && !isTweakingObstacles) {
    return;
  }

  const relevantEntities = [
    notesAboutToBeAdded,
    notesAboutToBeRemoved,
    obstaclesAboutToBeAdded,
    obstaclesAboutToBeRemoved,
  ].find(entity => entity.length > 0);

  // For now, assume that the first entity is the earliest.
  // Might make sense to sort them, so that if I delete a selected
  // cluster it brings me to the start of that cluster?
  const earliestEntity = relevantEntities[0];

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

  const entityTime =
    typeof earliestEntity._time === 'number'
      ? earliestEntity._time
      : earliestEntity.beatStart;

  console.log({ earliestEntity, entityTime });

  const isNoteVisible = entityTime > closeLimit && entityTime < farLimit;

  if (!isNoteVisible) {
    store.dispatch(jumpToBeat(entityTime, true, true));
  }
};

export default function createHistoryMiddleware() {
  return store => next => action => {
    switch (action.type) {
      case 'UNDO_NOTES': {
        const state = store.getState();

        const pastNotes = getPastNotes(state);
        const presentNotes = getNotes(state);
        const pastObstacles = getPastObstacles(state);
        const presentObstacles = getObstacles(state);

        jumpToEarliestNote(
          pastNotes,
          presentNotes,
          pastObstacles,
          presentObstacles,
          store
        );

        // Never interrupt the default action
        next(action);

        break;
      }

      case 'REDO_NOTES': {
        const state = store.getState();

        const presentNotes = getNotes(state);
        const futureNotes = getFutureNotes(state);
        const presentObstacles = getObstacles(state);
        const futureObstacles = getFutureObstacles(state);

        if (!futureNotes.length) {
          // Nothing to redo!
          return;
        }

        jumpToEarliestNote(
          presentNotes,
          futureNotes,
          presentObstacles,
          futureObstacles,
          store
        );

        // Never interrupt the default action
        next(action);

        break;
      }

      default:
        return next(action);
    }
  };
}
