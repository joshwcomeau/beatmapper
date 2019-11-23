/**
 * This function provides the range of visible beats, from the placement
 * grid to the far edge of the available space.
 */
import { SURFACE_DEPTHS } from '../constants';

export const calculateVisibleRange = (
  cursorPositionInBeats,
  beatDepth,
  graphicsLevel,
  { includeSpaceBeforeGrid } = { includeSpaceBeforeGrid: false }
) => {
  const surfaceDepth = SURFACE_DEPTHS[graphicsLevel];
  const numOfBeatsInRange = surfaceDepth / beatDepth;
  const numOfBeatsBeforeGrid = includeSpaceBeforeGrid
    ? numOfBeatsInRange * 0.2
    : 0;

  return [
    cursorPositionInBeats - numOfBeatsBeforeGrid,
    cursorPositionInBeats + numOfBeatsInRange,
  ];
};
