import React from 'react';

import { clamp } from '../utils';
import useBoundingBox from './use-bounding-box.hook';

export default function useMousePositionOverElement(callback, options = {}) {
  const [ref, bb] = useBoundingBox(options.boxDependencies);

  React.useEffect(() => {
    if (!bb) {
      return;
    }

    const handleMouseMove = ev => {
      // Check if the cursor is inside the box
      const insideX = ev.pageX > bb.left && ev.pageX < bb.right;
      const insideY = ev.pageY > bb.top && ev.pageY < bb.bottom;

      const x = clamp(ev.pageX - bb.left, 0, bb.width);
      const y = clamp(ev.pageY - bb.top, 0, bb.height);

      const shouldCall = options.onlyTriggerInside ? insideX && insideY : true;

      if (shouldCall) {
        callback(x, y, ev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [bb, callback, options.onlyTriggerInside]);

  return ref;
}
