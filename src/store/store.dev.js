import { createStore, applyMiddleware, compose } from 'redux';
import * as storage from 'redux-storage';

import rootReducer from '../reducers';
import { DEVTOOLS_ENABLED_IN_DEV } from '../constants';
import DevTools from '../components/DevTools';

import { createPersistenceEngine, createAllSharedMiddlewares } from './shared';

export default function configureStore(initialState) {
  const persistenceEngine = createPersistenceEngine();
  const middlewares = createAllSharedMiddlewares(persistenceEngine);

  const wrappedReducer = storage.reducer(rootReducer);

  let enhancers;
  if (DEVTOOLS_ENABLED_IN_DEV) {
    enhancers = compose(
      applyMiddleware(...middlewares),
      DevTools.instrument()
    );
  } else {
    enhancers = compose(applyMiddleware(...middlewares));
  }

  const store = createStore(wrappedReducer, initialState, enhancers);

  const load = storage.createLoader(persistenceEngine);
  load(store).catch(err => console.error('Failed to load previous state', err));

  window.store = store;

  return store;
}
