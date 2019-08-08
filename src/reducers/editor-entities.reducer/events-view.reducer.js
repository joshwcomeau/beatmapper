import undoable, { includeAction, groupByActionTypes } from 'redux-undo';
import produce from 'immer';

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

    // case 'LOAD_BEATMAP_ENTITIES': {
    //   return action.events || [];
    // }

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

      return produce(state, draftState => {
        state.tracks[trackId].push(newEvent);
      });
    }

    default:
      return state;
  }
};

export default events;
