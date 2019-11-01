import * as React from 'react';
import { connect } from 'react-redux';

import { getBeatDepth } from '../../reducers/navigation.reducer';
import { createObstacleFromMouseEvent } from '../../helpers/obstacles.helpers';

import ObstacleBox from '../ObstacleBox';

const TentativeObstacle = props => {
  const { mouseDownAt, mode, beatDepth, color } = props;

  // If no mouseOverAt is provided, it ought to be the same as the mouseDownAt.
  // They've clicked but haven't moved yet, ergo only one row/col is at play.
  let { mouseOverAt } = props;
  if (!mouseOverAt) {
    mouseOverAt = mouseDownAt;
  }

  const tentativeObstacle = createObstacleFromMouseEvent(
    mode,
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
