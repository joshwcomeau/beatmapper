/**
 * This reducer holds miscellaneous global concerns.
 * For now, just whether or not we've finished loading state from the
 * persistence system (indexeddb).
 */

const initialState = {
  hasInitialized: false,
};

export default function global(state = initialState, action) {
  switch (action.type) {
    case 'REDUX_STORAGE_LOAD': {
      return {
        ...state,
        hasInitialized: true,
      };
    }

    default:
      return state;
  }
}

export const getHasInitialized = state => state.global.hasInitialized;
