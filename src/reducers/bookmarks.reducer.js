const initialState = {};

export default function bookmarksReducer(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_BOOKMARK': {
      return {
        ...state,
        [action.beatNum]: {
          beatNum: action.beatNum,
          name: action.name,
          color: action.color,
        },
      };
    }

    default:
      return state;
  }
}
