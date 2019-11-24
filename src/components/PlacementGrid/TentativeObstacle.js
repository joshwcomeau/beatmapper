import * as React from 'react';
import { connect } from 'react-redux';

import { getBeatDepth } from '../../reducers/navigation.reducer';
import { createObstacleFromMouseEvent } from '../../helpers/obstacles.helpers';
import { getGridSize } from '../../reducers/songs.reducer';

import ObstacleBox from '../ObstacleBox';
import { getDefaultObstacleDuration } from '../../reducers/editor.reducer';

const TentativeObstacle = ({
  mouseDownAt,
  color,
  mode,
  beatDepth,
  defaultObstacleDuration,
  gridRows,
  gridCols,
  gridColWidth,
  gridRowHeight,
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
    gridColWidth,
    gridRowHeight,
    mouseDownAt,
    mouseOverAt,
    defaultObstacleDuration
  );

  tentativeObstacle.id = 'tentative';
  tentativeObstacle.tentative = true;
  tentativeObstacle.beatStart = 0;

  return (
    <ObstacleBox
      obstacle={tentativeObstacle}
      beatDepth={beatDepth}
      color={color}
      snapTo={1} // Doesn't matter
      gridRows={gridRows}
      gridCols={gridCols}
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
    defaultObstacleDuration: getDefaultObstacleDuration(state),
    gridRows: gridSize.numRows,
    gridCols: gridSize.numCols,
    gridColWidth: gridSize.colWidth,
    gridRowHeight: gridSize.rowHeight,
  };
};

export default connect(mapStateToProps)(TentativeObstacle);
