import React from 'react';
import { getFile } from '../services/file.service';

const getFileReaderMethodName = readAs => {
  if (readAs === 'dataUrl') {
    return 'readAsDataURL';
  }
};

// Create a simple cache for locally-retrieved files, so that files don't have
// to be re-retrieved every time from indexeddb.
// To avoid stale cache issues, we will never simply return what's in the cache.
// We always check in indexedDb. But, while we're checking, we'll serve up
// what's in the cache.
// TODO: If I ensure that filenames are unique, maybe I don't have to worry
// about stale caches?
const cache = {};

export default function useLocallyStoredFile(filename, readAs = 'dataUrl') {
  const [output, setOutput] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fileReader = React.useRef(null);

  React.useEffect(() => {
    if (!filename) {
      return;
    }

    getFile(filename).then(file => {
      fileReader.current = new FileReader();

      fileReader.current.onload = function(e) {
        setOutput(this.result);
        setLoading(false);

        cache[filename] = this.result;
      };

      const methodNameToCall = getFileReaderMethodName(readAs);

      try {
        fileReader.current[methodNameToCall](file);
      } catch (err) {
        console.error('Could not call method', methodNameToCall, 'on', file);
        throw new Error(err);
      }
    });

    return () => {
      if (fileReader.current) {
        fileReader.current.abort();
      }
    };
  }, [filename, readAs]);

  React.useEffect(() => {
    if (!filename) {
      return;
    }
    setLoading(true);
  }, [filename]);

  const returnedOutput = output || cache[filename];

  return [returnedOutput, loading];
}
