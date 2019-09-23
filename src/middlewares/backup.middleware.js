// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!../workers/autosave';

console.log(worker);
const instance = worker();
console.log(instance);

export default function createBackupMiddleware() {
  return store => next => action => {
    next(action);

    if (action.type === 'REDUX_STORAGE_SAVE') {
      const state = store.getState();

      instance.save(state);
    }
  };
}
