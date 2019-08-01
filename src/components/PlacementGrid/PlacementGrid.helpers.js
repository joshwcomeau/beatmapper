import { convertCartesianToPolar } from '../../utils';

const convertChunkIndexToDirection = chunkIndex => {
  switch (chunkIndex) {
    case 0:
      return 3;
    case 1:
      return 7;
    case 2:
      return 1;
    case 3:
      return 6;
    case 4:
      return 2;
    case 5:
      return 4;
    case 6:
      return 0;
    case 7:
      return 5;
    default:
      throw new Error('Unrecognized chunk index: ' + chunkIndex);
  }
};

export const getDirectionForDrag = (initialPosition, currentPosition) => {
  const deltaX = currentPosition.x - initialPosition.x;
  const deltaY = currentPosition.y - initialPosition.y;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const THRESHOLD = 35;

  if (distance < THRESHOLD) {
    return null;
  }

  const [angleInRadians] = convertCartesianToPolar(
    currentPosition,
    initialPosition
  );
  const angle = (angleInRadians * 180) / Math.PI;

  // We have 8 possible directions in a 360-degree circle, so each direction
  // gets a 45-degree wedge. The angles start going straight to the right,
  // and move clockwise:
  //
  //                   270deg
  //                    |
  //                    |
  //   --------------   .   -------------- 0deg
  //                    |
  //                    |
  //                    |
  //                   90deg
  //
  // Awkwardly, My right-most wedge needs to go from 337.5 deg to 22.5deg.
  // This'll be the first chunk, and they'll continue clockwise, from 0 to 8.
  const chunkSize = 360 / 8;
  const chunkOffset = chunkSize / 2;

  let chunkIndex;
  if (angle >= 337.5 || angle < 22.5) {
    chunkIndex = 0;
  } else {
    chunkIndex = Math.floor((angle + chunkOffset) / chunkSize);
  }

  // We need to convert this index to the batty set of directions the app uses.
  return convertChunkIndexToDirection(chunkIndex);
};
