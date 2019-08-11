import undoable, { includeAction, groupByActionTypes } from 'redux-undo';
import produce from 'immer';

import { flatten } from '../../utils';
import { EVENTS_VIEW } from '../../constants';

const initialState = {
  tracks: {
    laserLeft: [],
    laserRight: [],
    laserBack: [],
    primaryLight: [],
    trackNeons: [],
    largeRing: [],
    smallRing: [],
    laserSpeedLeft: [],
    laserSpeedRight: [],
  },
};

const LIGHTING_TRACKS = [
  'laserLeft',
  'laserRight',
  'laserBack',
  'primaryLight',
  'trackNeons',
];

const LASER_SPEED_TRACKS = ['laserSpeedLeft', 'laserSpeedRight'];

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'CLEAR_ENTITIES': {
      return initialState;
    }

    case 'LOAD_BEATMAP_ENTITIES': {
      // Entities are loaded all in 1 big array, since that's how they're saved
      // to disk. Reduce them into a map based on trackId
      if (!action.events || action.events.length === 0) {
        return state;
      }

      const tracks = action.events.reduce((acc, event) => {
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
        eventColor,
        eventLaserSpeed,
      } = action;

      const newEvent = {
        id,
        trackId,
        beatNum,
        type: eventType,
      };

      if (LIGHTING_TRACKS.includes(trackId)) {
        newEvent.color = eventColor;
      } else if (LASER_SPEED_TRACKS.includes(trackId)) {
        newEvent.laserSpeed = eventLaserSpeed;
      }

      return {
        ...state,
        tracks: {
          ...state.tracks,
          [trackId]: [...state.tracks[trackId], newEvent],
        },
      };
    }

    case 'DELETE_EVENT':
    case 'BULK_DELETE_EVENT': {
      const { id, trackId } = action;

      const newTrackArray = state.tracks[trackId].filter(ev => ev.id !== id);

      return {
        ...state,
        tracks: {
          ...state.tracks,
          [trackId]: newTrackArray,
        },
      };
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
      if (action.view !== EVENTS_VIEW) {
        return state;
      }

      return produce(state, draftState => {
        action.data.forEach(event => {
          draftState.tracks[event.trackId].push(event);
        });
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

    default:
      return state;
  }
};

//
//
//// SELECTORS
//
const getTracks = state => state.editorEntities.eventsView.tracks;

export const getEventsForTrack = (state, trackId) => {
  const tracks = getTracks(state);
  return tracks[trackId];
};

export const getAllEventsAsArray = state => {
  const tracks = getTracks(state);
  return flatten(Object.values(tracks));
};

export const getSelectedEvents = state => {
  const allEvents = getAllEventsAsArray(state);

  return allEvents.filter(event => event.selected);
};

export default events;
