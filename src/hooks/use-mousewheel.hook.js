/**
 * A hook that handles scrolling on a specified element WITHOUT scrolling the
 * page. Needs to be in a hook since you can't call ev.preventDefault() on
 * standard `onWheel` events.
 *
 * Use sparingly.
 */
import React from 'react';

import { throttle } from '../utils';

export default function useMousewheel(handleMouseWheel) {
  React.useEffect(() => {
    const throttledHandler = throttle(handleMouseWheel, 100);

    const wrappedHandler = ev => {
      ev.preventDefault();

      throttledHandler(ev);
    };

    window.addEventListener('wheel', wrappedHandler, { passive: false });

    return () => window.removeEventListener('wheel', wrappedHandler);
  }, [handleMouseWheel]);
}
