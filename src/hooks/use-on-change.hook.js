import React from 'react';

export default function useOnChange(callback, id) {
  const cachedId = React.useRef(id);

  const idChanged = id !== cachedId.current;

  if (idChanged) {
    callback();

    cachedId.current = id;
  }
}
