import { Action } from '../types';

interface State {
  view: 'notes' | 'events' | null;
  data: Array<any> | null;
}

const initialState = {
  view: null,
  data: null,
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
        const aBeatStart = typeof a._time === 'number' ? a._time : a.beatStart;
        const bBeatStart = typeof b._time === 'number' ? b._time : b.beatStart;

        return aBeatStart - bBeatStart;
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

export const getCopiedNotesAndObstacles = (state: any) => {
  const { view, data } = state.clipboard;

  return view === 'notes' ? data : [];
};
export const getCopiedEvents = (state: any) => {
  const { view, data } = state.clipboard;

  return view === 'events' ? data : [];
};
