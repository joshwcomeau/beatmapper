import React from 'react';
import { getFile } from '../services/file.service';

const getFileReaderMethodName = readAs => {
  if (readAs === 'dataUrl') {
    return 'readAsDataURL';
  }
};

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
      };

      const methodNameToCall = getFileReaderMethodName(readAs);

      fileReader.current[methodNameToCall](file);
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

  return [output, loading];
}
