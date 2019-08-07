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
  },
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NEW_SONG':
    case 'CLEAR_ENTITIES': {
      return initialState;
    }

    // case 'LOAD_BEATMAP_ENTITIES': {
    //   return action.events || [];
    // }

    default:
      return state;
  }
};

export default events;
