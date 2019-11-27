import { createSelector } from 'reselect';
import undoable, { includeAction, groupByActionTypes } from 'redux-undo';
import produce from 'immer';

import { EVENTS_VIEW, EVENT_TRACKS } from '../../constants';
import { nudgeEvents } from '../../helpers/events.helpers';
import { getStartAndEndBeat } from '../editor.reducer';
import { flatten } from '../../utils';

const createInitialState = () => ({
  // Creates a `tracks` mapping where each track ID is given an empty array.
  tracks: EVENT_TRACKS.reduce((acc, track) => {
    acc[track.id] = [];
    return acc;
  }, {}),
});

const LIGHTING_TRACKS = [
  'laserLeft',
  'laserRight',
  'laserBack',
  'primaryLight',
  'trackNeons',
];

const eventsView = undoable(
  (state = createInitialState(), action) => {
    switch (action.type) {
      case 'CREATE_NEW_SONG':
      case 'START_LOADING_SONG': {
        return createInitialState();
      }

      case 'LOAD_BEATMAP_ENTITIES': {
        if (!action.events || action.events.length === 0) {
          return createInitialState();
        }

        // MAYBE TEMP:
        // I'm noticing some weird bug where I get SO MANY EVENTS.
        // Remove all duplicates.
        const uniqueEvents = [];
        action.events.forEach(event => {
          const alreadyExists = uniqueEvents.some(uniqEvent => {
            return (
              uniqEvent.trackId === event.trackId &&
              uniqEvent.beatNum === event.beatNum
            );
          });

          if (!alreadyExists) {
            uniqueEvents.push(event);
          }
        });

        // Entities are loaded all in 1 big array, since that's how they're saved
        // to disk. Reduce them into a map based on trackId
        const initialState = createInitialState();
        const tracks = uniqueEvents.reduce((acc, event) => {
          if (!event) {
            return acc;
          }

          acc[event.trackId].push(event);
          return acc;
        }, initialState.tracks);

        return {
          ...state,
          tracks,
        };
      }

      case 'PLACE_EVENT': {
        const {
          id,
          trackId,
          beatNum,
          eventType,
          eventColorType,
          areLasersLocked,
        } = action;

        const newEvent = {
          id,
          trackId,
          beatNum,
          type: eventType,
        };

        if (LIGHTING_TRACKS.includes(trackId)) {
          newEvent.colorType = eventColorType;
        }

        const relevantEvents = state.tracks[trackId];
        const [indexToInsertAt, eventOverlaps] = findIndexForNewEvent(
          beatNum,
          relevantEvents
        );

        // Don't allow multiple blocks in the same cell. Rather than overwrite,
        // this strategy allows us to easily "fill gaps" by dragging over an area
        if (eventOverlaps) {
          return state;
        }

        return produce(state, draftState => {
          draftState.tracks[trackId].splice(indexToInsertAt, 0, newEvent);

          // Important: if the side lasers are "locked" we need to mimic this
          // event from the left laser to the right laser.
          if (areLasersLocked && trackId === 'laserLeft') {
            const mirrorTrackId = 'laserRight';

            const symmetricalEvent = {
              ...newEvent,
              id: getSymmetricalId(newEvent.id),
              trackId: mirrorTrackId,
            };

            const relevantEvents = state.tracks[mirrorTrackId];
            const [indexToInsertAt, eventOverlaps] = findIndexForNewEvent(
              beatNum,
              relevantEvents
            );

            if (eventOverlaps) {
              return;
            }

            draftState.tracks[mirrorTrackId].splice(
              indexToInsertAt,
              0,
              symmetricalEvent
            );
          }
        });
      }

      case 'CHANGE_LASER_SPEED': {
        const { id, trackId, beatNum, speed, areLasersLocked } = action;

        const newEvent = {
          id,
          trackId,
          beatNum,
          laserSpeed: speed,
        };

        const relevantEvents = state.tracks[trackId];
        const [indexToInsertAt, eventOverlaps] = findIndexForNewEvent(
          beatNum,
          relevantEvents
        );

        return produce(state, draftState => {
          const numToRemove = eventOverlaps ? 1 : 0;
          draftState.tracks[trackId].splice(
            indexToInsertAt,
            numToRemove,
            newEvent
          );

          // Repeat all the above stuff for the laserSpeedRight track, if we're
          // modifying the left track and have locked the lasers together.
          if (areLasersLocked && trackId === 'laserSpeedLeft') {
            const symmetricalTrackId = 'laserSpeedRight';
            const symmetricalEvent = {
              ...newEvent,
              id: getSymmetricalId(newEvent.id),
              trackId: symmetricalTrackId,
            };

            const relevantEvents = state.tracks[symmetricalTrackId];
            const [indexToInsertAt, eventOverlaps] = findIndexForNewEvent(
              beatNum,
              relevantEvents
            );
            const numToRemove = eventOverlaps ? 1 : 0;
            draftState.tracks[symmetricalTrackId].splice(
              indexToInsertAt,
              numToRemove,
              symmetricalEvent
            );
          }
        });
      }

      case 'DELETE_EVENT':
      case 'BULK_DELETE_EVENT': {
        const { id, trackId, areLasersLocked } = action;

        return produce(state, draftState => {
          draftState.tracks[trackId] = draftState.tracks[trackId].filter(
            ev => ev.id !== id
          );

          const mirroredTracks = ['laserLeft', 'laserSpeedLeft'];

          if (areLasersLocked && mirroredTracks.includes(trackId)) {
            const mirroredTrackId = trackId.replace('Left', 'Right');

            draftState.tracks[mirroredTrackId] = draftState.tracks[
              mirroredTrackId
            ].filter(ev => ev.id !== getSymmetricalId(id));
          }
        });
      }

      case 'DELETE_SELECTED_EVENTS': {
        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            draftState.tracks[trackId] = draftState.tracks[trackId].filter(
              event => !event.selected
            );
          });
        });
      }

      case 'CUT_SELECTION': {
        if (action.view !== EVENTS_VIEW) {
          return state;
        }

        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            draftState.tracks[trackId] = draftState.tracks[trackId].filter(
              event => {
                return !event.selected;
              }
            );
          });
        });
      }

      case 'PASTE_SELECTION': {
        const { view, data, pasteAtBeat } = action;

        if (view !== EVENTS_VIEW) {
          return state;
        }

        // Deselect all events.
        return produce(state, draftState => {
          deselectAll(draftState);

          const earliestEventAt = data[0].beatNum;
          const deltaBetweenPeriods = pasteAtBeat - earliestEventAt;

          const timeShiftedData = data.map(event => ({
            ...event,
            selected: true,
            beatNum: event.beatNum + deltaBetweenPeriods,
          }));

          timeShiftedData.forEach(event => {
            // Shift the event by the delta between
            draftState.tracks[event.trackId].push(event);
          });
        });
      }

      case 'SWITCH_EVENT_COLOR': {
        const { id, trackId } = action;

        return produce(state, draftState => {
          const eventIndex = state.tracks[trackId].findIndex(
            ev => ev.id === id
          );

          const event = draftState.tracks[trackId][eventIndex];

          event.colorType = event.colorType === 'blue' ? 'red' : 'blue';
        });
      }

      case 'SELECT_EVENT':
      case 'DESELECT_EVENT': {
        const { id, trackId } = action;

        const eventIndex = state.tracks[trackId].findIndex(ev => ev.id === id);

        return produce(state, draftState => {
          draftState.tracks[trackId][eventIndex].selected =
            action.type === 'SELECT_EVENT';
        });
      }

      case 'SELECT_ALL': {
        const { view, metadata } = action;

        if (view !== EVENTS_VIEW) {
          return state;
        }

        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            // Set all events within our frame as selected, and deselect any
            // selected events outside of it
            draftState.tracks[trackId].forEach(event => {
              const shouldBeSelected =
                event.beatNum >= metadata.startBeat &&
                event.beatNum < metadata.endBeat;

              event.selected = shouldBeSelected;
            });
          });
        });
      }

      case 'DESELECT_ALL': {
        const { view } = action;

        if (view !== EVENTS_VIEW) {
          return state;
        }

        return produce(state, draftState => {
          deselectAll(draftState);
        });
      }

      case 'SELECT_ALL_IN_RANGE': {
        const { start, end, view } = action;

        if (view !== EVENTS_VIEW) {
          return state;
        }

        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            // Set all events within our frame as selected, and deselect any
            // selected events outside of it
            draftState.tracks[trackId].forEach(event => {
              const shouldBeSelected =
                event.beatNum >= start && event.beatNum < end;

              event.selected = shouldBeSelected;
            });
          });
        });
      }

      case 'COMMIT_SELECTION': {
        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            draftState.tracks[trackId].forEach(event => {
              if (event.selected === 'tentative') {
                event.selected = true;
              }
            });
          });
        });
      }

      case 'DRAW_SELECTION_BOX': {
        const { selectionBoxInBeats, metadata } = action;

        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            const trackIndex = EVENT_TRACKS.findIndex(
              track => track.id === trackId
            );

            const isTrackIdWithinBox =
              trackIndex >= selectionBoxInBeats.startTrackIndex &&
              trackIndex <= selectionBoxInBeats.endTrackIndex;

            draftState.tracks[trackId].forEach(event => {
              const isInWindow =
                event.beatNum >= metadata.window.startBeat &&
                event.beatNum <= metadata.window.endBeat;

              if (!isInWindow) {
                return;
              }

              const isInSelectionBox =
                isTrackIdWithinBox &&
                event.beatNum >= selectionBoxInBeats.startBeat &&
                event.beatNum <= selectionBoxInBeats.endBeat;

              if (isInSelectionBox) {
                event.selected = 'tentative';
              } else {
                if (event.selected === 'tentative') {
                  event.selected = false;
                }
              }
            });
          });
        });
      }

      case 'NUDGE_SELECTION': {
        const { view, direction, amount } = action;

        if (view !== EVENTS_VIEW) {
          return state;
        }

        return produce(state, draftState => {
          const trackIds = Object.keys(draftState.tracks);

          trackIds.forEach(trackId => {
            nudgeEvents(direction, amount, draftState.tracks[trackId]);
          });
        });
      }

      default:
        return state;
    }
  },
  {
    limit: 200,
    undoType: 'UNDO_EVENTS',
    redoType: 'REDO_EVENTS',
    filter: includeAction([
      'PLACE_EVENT',
      'CHANGE_LASER_SPEED',
      'DELETE_EVENT',
      'DELETE_SELECTED_EVENTS',
      'BULK_DELETE_EVENT',
      'CUT_SELECTION',
      'PASTE_SELECTION',
      'SWITCH_EVENT_COLOR',
      'NUDGE_SELECTION',
    ]),
    groupBy: groupByActionTypes(['BULK_DELETE_EVENT']),
  }
);

//
//
//// HELPERS
//

/**
 * Iterate through all tracks and mark all events as deselected.
 *
 * !! WARNING !! This method mutates the argument passed in. It's meant to be
 * used within a `produce` callback.
 */
const deselectAll = draftState => {
  const trackIds = Object.keys(draftState.tracks);

  trackIds.forEach(trackId => {
    draftState.tracks[trackId].forEach(event => {
      event.selected = false;
    });
  });

  return draftState;
};

/**
 * In addition to returning an index so that the caller knows where to insert
 * the event, this method also returns whether or not there is already an
 * event at the exact same beatNum.
 *
 * @returns [ index: number, overlaps: boolean ]
 */
const findIndexForNewEvent = (beatNum, relevantEvents) => {
  // Find the spot for this event. All events should be added in
  // chronological order.
  let indexToInsertAt = 0;
  let eventOverlaps = false;
  for (let i = relevantEvents.length - 1; i >= 0; i--) {
    const event = relevantEvents[i];

    if (event.beatNum === beatNum) {
      eventOverlaps = true;
      indexToInsertAt = i;
      break;
    }

    // If this event is before our new one, we can insert it right after
    if (event.beatNum < beatNum) {
      indexToInsertAt = i + 1;
      break;
    }
  }

  return [indexToInsertAt, eventOverlaps];
};

const getSymmetricalId = id => `${id}-mirrored`;

//
//
///// SELECTOR HELPERS
//    (not exported, used purely within the exported selectors)
//
const filterEventsBeforeBeat = (tracks, trackId, beforeBeat) => {
  return tracks[trackId].filter(event => event.beatNum < beforeBeat);
};

//
//
//// SELECTORS
//
export const getTracks = state =>
  state.editorEntities.eventsView.present.tracks;

const getEventsView = state => state.editorEntities.eventsView;

const createHistoryGetter = set =>
  createSelector(getEventsView, eventsView => {
    const snapshots = eventsView[set];

    const mostRecentSnapshot = snapshots[snapshots.length - 1];

    if (!mostRecentSnapshot) {
      return null;
    }

    const events = flatten(Object.values(mostRecentSnapshot.tracks));

    return events;
  });

export const getEvents = createSelector(getTracks, tracks =>
  flatten(Object.values(tracks))
);
export const getPastEvents = createHistoryGetter('past');
export const getFutureEvents = createHistoryGetter('future');

export const makeGetEventsForTrack = trackId =>
  createSelector(
    getStartAndEndBeat,
    getTracks,
    ({ startBeat, endBeat }, tracks) => {
      return tracks[trackId].filter(
        event => event.beatNum >= startBeat && event.beatNum < endBeat
      );
    }
  );

export const getEventForTrackAtBeat = (state, trackId, startBeat) => {
  const tracks = getTracks(state);
  const relevantEvents = filterEventsBeforeBeat(tracks, trackId, startBeat);

  if (relevantEvents.length === 0) {
    return null;
  }

  return relevantEvents[relevantEvents.length - 1];
};

export const makeGetInitialTrackLightingColorType = trackId =>
  createSelector(getStartAndEndBeat, getTracks, ({ startBeat }, tracks) => {
    const eventsInWindow = filterEventsBeforeBeat(tracks, trackId, startBeat);
    const lastEvent = eventsInWindow[eventsInWindow.length - 1];

    if (!lastEvent) {
      return null;
    }

    const isLastEventOn = lastEvent.type === 'on' || lastEvent.type === 'flash';

    return isLastEventOn ? lastEvent.colorType : null;
  });

export const getAllEventsAsArray = createSelector(getTracks, tracks => {
  const flatEventsArray = flatten(Object.values(tracks));
  // Sort the array so that events aren't grouped by track, but instead are
  // wholly chronological
  return flatEventsArray.sort((a, b) => a.beatNum - b.beatNum);
});

export const getSelectedEvents = state => {
  const allEvents = getAllEventsAsArray(state);

  return allEvents.filter(event => event.selected);
};

export const getTrackSpeedAtBeat = (state, trackId, beatNum) => {
  const tracks = getTracks(state);
  const events = filterEventsBeforeBeat(tracks, trackId, beatNum).reverse();

  if (!events.length) {
    return 0;
  }

  return events[0].laserSpeed;
};

export default eventsView;
