import * as React from 'react';
import ObstacleBox from '../ObstacleBox';

const TentativeObstacle = props => {
  const { mouseDownAt } = props;
  let { mouseOverAt } = props;
  if (typeof mouseOverAt === 'undefined') {
    mouseOverAt = mouseDownAt;
  }

  const lane = Math.min(mouseDownAt.colIndex, mouseOverAt.colIndex);

  const colspan = Math.abs(mouseDownAt.colIndex - mouseOverAt.colIndex) + 1;

  const tentativeObstacle = {
    id: 'tentative',
    lane,
    type: mouseOverAt.rowIndex === 2 ? 'ceiling' : 'wall',
    beatStart: 0,
    beatDuration: 4,
    colspan,
    tentative: true,
  };

  // // Clamp our colspan to a max of 2
  if (tentativeObstacle.colspan > 2) {
    const overBy = tentativeObstacle.colspan - 2;
    tentativeObstacle.colspan = 2;

    const colspanDelta = mouseOverAt.colIndex - mouseDownAt.colIndex;

    if (colspanDelta > 0) {
      tentativeObstacle.lane += overBy;
    } else {
      tentativeObstacle.lane = mouseOverAt.colIndex;
    }
  }

  return (
    <ObstacleBox
      obstacle={tentativeObstacle}
      snapTo={1} // Doesn't matter
      handleDelete={() => {}}
      handleResize={() => {}}
      handleClick={() => {}}
    />
  );
};

export default TentativeObstacle;
