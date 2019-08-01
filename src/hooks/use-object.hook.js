import React from 'react';
import OBJLoader from '../vendor/obj-loader';

const loadingMap = {};

export default function useObject(path) {
  const [loadedObject, setLoadedObject] = React.useState(null);

  // `existing` will be a promise that resolves once the object is loaded,
  // IF this object has already started being loaded.
  const existing = loadingMap[path];

  if (!existing) {
    // If this is the first request for the object, start loading it.
    loadingMap[path] = new Promise((resolve, reject) => {
      new OBJLoader().load(path, result => {
        resolve(result);
      });
    });
  }

  loadingMap[path]
    .then(result => {
      setLoadedObject(result);
    })
    .catch(err => console.error('Could not load object', err));

  return loadedObject;
}
