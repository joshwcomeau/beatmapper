import { createStore, applyMiddleware, compose } from 'redux';
import * as storage from 'redux-storage';

import rootReducer from '../reducers';
import { createPersistenceEngine, createAllSharedMiddlewares } from './shared';

export default function configureStore(initialState) {
  const persistenceEngine = createPersistenceEngine();
  const middlewares = createAllSharedMiddlewares(persistenceEngine);

  const wrappedReducer = storage.reducer(rootReducer);

  const store = createStore(
    wrappedReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  const load = storage.createLoader(persistenceEngine);
  load(store).catch(err => console.error('Failed to load previous state', err));

  return store;
}
