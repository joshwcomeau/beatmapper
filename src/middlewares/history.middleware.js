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
  getEvents,
  getPastEvents,
  getFutureEvents,
} from '../reducers/editor-entities.reducer/events-view.reducer';
import { getStartAndEndBeat } from '../reducers/editor.reducer';

import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../reducers/navigation.reducer';
import { getGraphicsLevel } from '../reducers/user.reducer';
import { findUniquesWithinArrays } from '../utils';

const jumpToEarliestNote = (
  earlierNotes,
  laterNotes,
  earlierObstacles,
  laterObstacles,
  store
) => {
  const relevantNotes = findUniquesWithinArrays(earlierNotes, laterNotes);
  const relevantObstacles = findUniquesWithinArrays(
    earlierObstacles,
    laterObstacles
  );

  if (relevantNotes.length === 0 && relevantObstacles.length === 0) {
    return;
  }

  const relevantEntities = [relevantNotes, relevantObstacles].find(
    entity => entity.length > 0
  );

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

  const isEntityVisible = entityTime > closeLimit && entityTime < farLimit;

  if (!isEntityVisible) {
    store.dispatch(jumpToBeat(entityTime, true, true));
  }
};

const switchEventPagesIfNecessary = (earlierEvents, currentEvents, store) => {
  const relevantEvents = findUniquesWithinArrays(earlierEvents, currentEvents);

  if (relevantEvents.length === 0) {
    return;
  }

  const { startBeat, endBeat } = getStartAndEndBeat(store.getState());

  const someItemsWithinWindow = relevantEvents.some(event => {
    return event.beatNum >= startBeat && event.beatNum < endBeat;
  });

  if (someItemsWithinWindow) {
    return;
  }

  const earliestBeatOutOfWindow = relevantEvents.find(event => {
    return event.beatNum < startBeat || event.beatNum >= endBeat;
  });

  // Should be impossible
  if (!earliestBeatOutOfWindow) {
    return;
  }

  store.dispatch(jumpToBeat(earliestBeatOutOfWindow.beatNum, true, true));
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

      case 'UNDO_EVENTS': {
        const state = store.getState();

        const pastEvents = getPastEvents(state);
        const presentEvents = getEvents(state);

        if (pastEvents === null) {
          return;
        }

        switchEventPagesIfNecessary(pastEvents, presentEvents, store);

        next(action);

        break;
      }

      case 'REDO_EVENTS': {
        const state = store.getState();

        const presentEvents = getEvents(state);
        const futureEvents = getFutureEvents(state);

        if (futureEvents === null) {
          return;
        }

        switchEventPagesIfNecessary(presentEvents, futureEvents, store);

        next(action);

        break;
      }

      default:
        return next(action);
    }
  };
}
