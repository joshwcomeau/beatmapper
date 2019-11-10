import { BLOCK_PLACEMENT_SQUARE_SIZE, SONG_OFFSET } from '../../constants';

import { Obstacle, MappingExtensionObstacle } from '../../types';

// TODO: move to constants, share with PlacementGrid
const CELL_SIZE_SCALE = 1.5;

export const getPositionForObstacleNew = (
  obstacle: Obstacle,
  obstacleDimensions: { width: number; height: number; depth: number },
  zOffset: number
): [number, number, number] => {
  let position = { x: 0, y: 0, z: 0 };

  // ----------- X ------------
  const columnWidth = obstacleDimensions.width / obstacle.colspan;
  const OFFSET_X = columnWidth * CELL_SIZE_SCALE * -1;

  console.log({ OFFSET_X });

  position.x = obstacle.lane * BLOCK_PLACEMENT_SQUARE_SIZE + OFFSET_X;
  position.x += obstacleDimensions.width / 2 - BLOCK_PLACEMENT_SQUARE_SIZE / 2;

  // ----------- Y -------------
  if (obstacle.type === 'extension') {
    let mapObstacle = obstacle as MappingExtensionObstacle;
    const OFFSET_Y = BLOCK_PLACEMENT_SQUARE_SIZE * -1;
    position.y = mapObstacle.rowIndex * BLOCK_PLACEMENT_SQUARE_SIZE + OFFSET_Y;
    position.y +=
      obstacleDimensions.height / 2 - BLOCK_PLACEMENT_SQUARE_SIZE / 2;
  } else {
    // In a traditional world, there are two kinds, `ceiling` and `wall`.
    // We can just use hardcoded values for each kind.
    // TODO!
  }

  // -------------- Z -------------
  const zFront = obstacle.beatStart * zOffset * -1 - SONG_OFFSET;
  position.z = zFront - obstacleDimensions.depth / 2 + 0.1;

  return [position.x, position.y, position.z];
};

// This method gets the position in terms of the obstacle's top-left corner!
// This will need to be adjusted.
export const getPositionForObstacle = (
  { lane, beatStart, type, rowIndex }: any,
  beatDepth: number
): [number, number, number] => {
  // Our `x` parameter is controlled by `lane`.
  // TBH I forget why this formula works and I'm too lazy to sort it out rn
  const OFFSET_X = BLOCK_PLACEMENT_SQUARE_SIZE;

  const x = (lane - 1) * BLOCK_PLACEMENT_SQUARE_SIZE - OFFSET_X;

  let y;
  if (type === 'wall' || type === 'ceiling') {
    // In the original 4x3 grid system without mods, obstacles are either walls
    // or ceilings, and they always start at the same place (the type dictates
    // how far down they reach).
    y = BLOCK_PLACEMENT_SQUARE_SIZE * 1.75;
  } else {
    // 'extension' walls can start at any point, and they behave much like lanes
    // do for the opposite axis
    const OFFSET_Y = BLOCK_PLACEMENT_SQUARE_SIZE * 1.5;
    y = rowIndex * BLOCK_PLACEMENT_SQUARE_SIZE - OFFSET_Y;
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

export const getDimensionsForObstacle = (
  obstacle: Obstacle,
  beatDepth: number
) => {
  let width: number;
  let height: number;
  let depth: number;

  width = obstacle.colspan * BLOCK_PLACEMENT_SQUARE_SIZE;
  depth = obstacle.beatDuration * beatDepth;

  if (obstacle.type === 'extension') {
    const extensionObstacle = obstacle as MappingExtensionObstacle;
    height = extensionObstacle.rowspan * BLOCK_PLACEMENT_SQUARE_SIZE;
  } else {
    // Height is tricky since it depends on the type.
    height =
      obstacle.type === 'wall'
        ? BLOCK_PLACEMENT_SQUARE_SIZE * 3.5
        : BLOCK_PLACEMENT_SQUARE_SIZE * 1.25;
  }

  // We don't want to allow invisible / 0-depth walls
  if (depth === 0) {
    depth = 0.01;
  }

  return { width, height, depth };
};
