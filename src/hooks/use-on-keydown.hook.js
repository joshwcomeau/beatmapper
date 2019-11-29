import React from 'react';

export default function useOnKeydown(key, callback, deps) {
  React.useEffect(() => {
    const handleKeydown = ev => {
      if (ev.code === key) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, deps); // eslint-disable-line
}
