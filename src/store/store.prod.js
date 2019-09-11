import { createStore, applyMiddleware, compose } from 'redux';
import * as storage from 'redux-storage';
import thunk from 'redux-thunk';
import { createStateSyncMiddleware } from 'redux-state-sync';

import rootReducer from '../reducers';
import createSongMiddleware from '../middlewares/song.middleware';
import createSelectionMiddleware from '../middlewares/selection.middleware';
import createPackagingMiddleware from '../middlewares/packaging.middleware';
import createBackupMiddleware from '../middlewares/backup.middleware';
import createDemoMiddleware from '../middlewares/demo.middleware';
import createEngine from './persistence-engine';

export default function configureStore(initialState) {
  const persistenceEngine = createEngine(['user', 'editor', ['songs', 'byId']]);

  const stateSyncMiddleware = createStateSyncMiddleware();

  const songMiddleware = createSongMiddleware();
  const selectionMiddleware = createSelectionMiddleware();
  const downloadMiddleware = createPackagingMiddleware();
  const backupMiddleware = createBackupMiddleware();
  const demoMiddleware = createDemoMiddleware();
  const storageMiddleware = storage.createMiddleware(persistenceEngine);

  const wrappedReducer = storage.reducer(rootReducer);

  const middlewares = [
    // NOTE: This middleware should be first. I get weird errors otherwise.
    stateSyncMiddleware,
    thunk,
    storageMiddleware,
    songMiddleware,
    selectionMiddleware,
    downloadMiddleware,
    backupMiddleware,
    demoMiddleware,
  ];

  const store = createStore(
    wrappedReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  const load = storage.createLoader(persistenceEngine);
  load(store).catch(err => console.error('Failed to load previous state', err));

  return store;
}
