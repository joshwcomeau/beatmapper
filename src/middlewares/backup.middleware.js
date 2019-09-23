// eslint-disable-next-line import/no-webpack-loader-syntax
import autosaveWorker from '../workers/autosave.worker';

const instance = autosaveWorker();

export default function createBackupMiddleware() {
  return store => next => action => {
    next(action);

    if (action.type === 'REDUX_STORAGE_SAVE') {
      const state = store.getState();

      instance.save(state);
    }
  };
}
