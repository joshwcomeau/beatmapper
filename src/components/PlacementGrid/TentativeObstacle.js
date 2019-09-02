import * as React from 'react';
import { connect } from 'react-redux';
import ObstacleBox from '../ObstacleBox';
import { getBeatDepth } from '../../reducers/navigation.reducer';

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

  // // Clamp our wall colspan to a max of 2
  if (tentativeObstacle.type === 'wall' && tentativeObstacle.colspan > 2) {
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
      beatDepth={props.beatDepth}
      snapTo={1} // Doesn't matter
      handleDelete={() => {}}
      handleResize={() => {}}
      handleClick={() => {}}
    />
  );
};

const mapStateToProps = state => {
  return {
    beatDepth: getBeatDepth(state),
  };
};

export default connect(mapStateToProps)(TentativeObstacle);
