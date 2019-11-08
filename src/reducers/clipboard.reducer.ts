import { Action } from '../types';
import { NOTES_VIEW } from '../constants';

interface State {
  view: 'notes' | 'events' | null;
  data: Array<any> | null;
}

const initialState = {
  view: null,
  data: null,
};

const getBeatNumForItem = (item: any) => {
  if (typeof item._time === 'number') {
    return item._time;
  } else if (typeof item.beatStart === 'number') {
    return item.beatStart;
  } else if (typeof item.beatNum === 'number') {
    return item.beatNum;
  } else {
    throw new Error('Could not determine time for event');
  }
};

export default function clipboard(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'CUT_SELECTION':
    case 'COPY_SELECTION': {
      const { view, data } = action;

      // We want to sort the data so that it goes from earliest beat to latest
      // beat. This is made slightly tricky by the fact that notes have a
      // different data format from obstacles and events :/
      const sortedData = [...data].sort((a: any, b: any) => {
        const aBeatNum = getBeatNumForItem(a);
        const bBeatNum = getBeatNumForItem(b);

        return aBeatNum - bBeatNum;
      });

      return {
        view,
        data: sortedData,
      };
    }

    default:
      return state;
  }
}

export const getCopiedData = (state: any) => state.clipboard.data;

export const getHasCopiedNotes = (state: any) =>
  state.clipboard.data && state.clipboard.view === NOTES_VIEW;
