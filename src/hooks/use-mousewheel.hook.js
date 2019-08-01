/**
 * A hook that handles scrolling on a specified element WITHOUT scrolling the
 * page. Needs to be in a hook since you can't call ev.preventDefault() on
 * standard `onWheel` events.
 *
 * Use sparingly.
 */
import React from 'react';

import { throttle } from '../utils';

export default function useMousewheel(ref, preventDefault, handleMouseWheel) {
  const throttledHandler = throttle(handleMouseWheel, 100);

  const wrappedHandler = React.useCallback(
    ev => {
      if (preventDefault) {
        ev.preventDefault();
      }

      throttledHandler(ev);
    },
    [throttledHandler, preventDefault]
  );

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const scrollEl = ref.current;
    scrollEl.addEventListener('wheel', wrappedHandler);

    return () => scrollEl.removeEventListener('wheel', wrappedHandler);
  }, [handleMouseWheel, ref, wrappedHandler]);
}
