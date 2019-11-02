import * as React from 'react';
import { connect } from 'react-redux';

import { getBeatDepth } from '../../reducers/navigation.reducer';
import { createObstacleFromMouseEvent } from '../../helpers/obstacles.helpers';
import { getGridSize } from '../../reducers/songs.reducer';

import ObstacleBox from '../ObstacleBox';

const TentativeObstacle = ({
  mouseDownAt,
  mode,
  color,
  beatDepth,
  gridRows,
  gridCols,
  gridCellSize,
  ...rest
}) => {
  // If no mouseOverAt is provided, it ought to be the same as the mouseDownAt.
  // They've clicked but haven't moved yet, ergo only one row/col is at play.
  let { mouseOverAt } = rest;
  if (!mouseOverAt) {
    mouseOverAt = mouseDownAt;
  }

  const tentativeObstacle = createObstacleFromMouseEvent(
    mode,
    gridCols,
    gridRows,
    mouseDownAt,
    mouseOverAt,
    0
  );

  tentativeObstacle.id = 'tentative';
  tentativeObstacle.tentative = true;

  return (
    <ObstacleBox
      obstacle={tentativeObstacle}
      beatDepth={beatDepth}
      color={color}
      snapTo={1} // Doesn't matter
      gridRows={gridRows}
      gridCols={gridCols}
      gridCellSize={gridCellSize}
      handleDelete={() => {}}
      handleResize={() => {}}
      handleClick={() => {}}
    />
  );
};

const mapStateToProps = state => {
  const gridSize = getGridSize(state);

  return {
    beatDepth: getBeatDepth(state),
    gridRows: gridSize.numRows,
    gridCols: gridSize.numCols,
    gridCellSize: gridSize.cellSize,
  };
};

export default connect(mapStateToProps)(TentativeObstacle);
