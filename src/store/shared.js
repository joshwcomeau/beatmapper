import thunk from 'redux-thunk';
import { createStateSyncMiddleware } from 'redux-state-sync';
import * as storage from 'redux-storage';

import createSongMiddleware from '../middlewares/song.middleware';
import createSelectionMiddleware from '../middlewares/selection.middleware';
import createPackagingMiddleware from '../middlewares/packaging.middleware';
import createBackupMiddleware from '../middlewares/backup.middleware';
import createDemoMiddleware from '../middlewares/demo.middleware';

import createEngine from './persistence-engine';

export const createPersistenceEngine = () =>
  createEngine(['user', 'editor', ['songs', 'byId']]);

export const createAllSharedMiddlewares = persistenceEngine => {
  const stateSyncMiddleware = createStateSyncMiddleware({
    // We don't need to save in other tabs
    blacklist: [
      'REDUX_STORAGE_SAVE',
      'START_PLAYING',
      'PAUSE_PLAYING',
      'STOP_PLAYING',
      'TOGGLE_PLAYING',
    ],
  });

  const songMiddleware = createSongMiddleware();
  const selectionMiddleware = createSelectionMiddleware();
  const downloadMiddleware = createPackagingMiddleware();
  const backupMiddleware = createBackupMiddleware();
  const demoMiddleware = createDemoMiddleware();
  const storageMiddleware = storage.createMiddleware(persistenceEngine);

  return [
    // Thunk has to go first, so that other middlewares don't get functions
    // dispatched.
    thunk,
    // For unknown reasons, things crash when `stateSyncMiddleware` is further
    // down.
    stateSyncMiddleware,
    storageMiddleware,
    songMiddleware,
    selectionMiddleware,
    downloadMiddleware,
    backupMiddleware,
    demoMiddleware,
  ];
};
