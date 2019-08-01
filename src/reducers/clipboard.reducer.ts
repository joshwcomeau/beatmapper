import { Action } from '../types';

interface State {
  type: 'notes' | null;
  data: Array<any>;
}

const initialState = {
  type: null,
  data: [],
};

export default function clipboard(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'CUT_SELECTED_NOTES':
    case 'COPY_SELECTED_NOTES': {
      return {
        type: 'notes',
        data: action.notes,
      };
    }

    default:
      return state;
  }
}

export const getCopiedNotes = (state: any) => {
  const { type, data } = state.clipboard;
  return type === 'notes' ? data : [];
};
