/**
 * Store redux state in local-storage, so that the app can be rehydrated
 * when the page is refreshed.
 */

import localforage from 'localforage';
import debounce from 'redux-storage-decorator-debounce';
import filter from 'redux-storage-decorator-filter';

const key =
  process.env.NODE_ENV === 'development' ? 'redux-state-dev' : 'redux-state';

const config = {
  driver: localforage.INDEXEDDB,
  name: 'beat-mapper-state',
};

const createEngine = (whitelist = []) => {
  // This `createEngine` function modified
  // https://raw.githubusercontent.com/mathieudutour/redux-storage-engine-localforage/master/src/index.js
  const reduxStore = localforage.createInstance({
    name: 'BeatMapper redux state',
  });

  function rejectWithMessage(error) {
    return Promise.reject(error.message);
  }

  reduxStore.config(config);

  let engine = {
    load() {
      return reduxStore
        .getItem(key)
        .then(jsonState => JSON.parse(jsonState) || {})
        .catch(rejectWithMessage);
    },

    save(state) {
      return Promise.resolve()
        .then(() => JSON.stringify(state))
        .then(jsonState => reduxStore.setItem(key, jsonState))
        .catch(rejectWithMessage);
    },
  };

  // TODO: Add migrations here, if/when necessary
  // engine = handleMigrations(engine)

  engine = debounce(engine, 250);

  engine = filter(engine, whitelist);

  return engine;
};

export default createEngine;
