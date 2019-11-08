import { BLOCK_COLUMN_WIDTH, SONG_OFFSET } from '../../constants';

import { Obstacle } from '../../types';

// This method gets the position in terms of the obstacle's top-left corner!
// This will need to be adjusted.
export const getPositionForObstacle = (
  { lane, beatStart, type, rowIndex }: any,
  beatDepth: number
): [number, number, number] => {
  // Our `x` parameter is controlled by `lane`.
  // TBH I forget why this formula works and I'm too lazy to sort it out rn
  const OFFSET_X = BLOCK_COLUMN_WIDTH;

  const x = (lane - 1) * BLOCK_COLUMN_WIDTH - OFFSET_X;

  let y;
  if (type === 'wall' || type === 'ceiling') {
    // In the original 4x3 grid system without mods, obstacles are either walls
    // or ceilings, and they always start at the same place (the type dictates
    // how far down they reach).
    y = BLOCK_COLUMN_WIDTH * 1.75;
  } else {
    // 'extension' walls can start at any point, and they behave much like lanes
    // do for the opposite axis
    const OFFSET_Y = BLOCK_COLUMN_WIDTH * 1.5;
    y = rowIndex * BLOCK_COLUMN_WIDTH - OFFSET_Y;
  }

  // Our `y` parameter is always the same, because our block always starts
  // at the top. The type (wallf | ceiling) dictates whether it reaches down
  // to the floor or not, but given that this method only cares about top-left,
  // that isn't a concern for now.
  // The very top of our object is at

  // since, again, we only care about the top-left-front of our shape,
  // this one is easy: it's `beatStart` number of beats down the pike, plus whatever
  // offset we have, similar to SongBlocks
  const z = beatStart * beatDepth * -1 - SONG_OFFSET;

  return [x, y, z];
};

export const getDimensionsForObstacle = (obstacle: any, beatDepth: number) => {
  // Width is easy
  const width = obstacle.colspan * BLOCK_COLUMN_WIDTH;

  // Height is tricky since it depends on the type.
  // prettier-ignore
  const height = obstacle.type === 'extension'
    ? obstacle.rowspan * BLOCK_COLUMN_WIDTH
    : obstacle.type === 'wall'
      ? BLOCK_COLUMN_WIDTH * 3.5
      : BLOCK_COLUMN_WIDTH * 1.25;

  let depth = obstacle.beatDuration * beatDepth;

  // We don't want to allow invisible / 0-depth walls
  if (depth === 0) {
    depth = 0.01;
  }

  return { width, height, depth };
};
