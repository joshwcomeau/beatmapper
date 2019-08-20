import uuid from 'uuid/v1';

export const convertObstaclesToRedux = obstacles => {
  return obstacles.map(o => {
    // We want to truncate widths that fall outside the acceptable parameters
    // (4 columns).
    let truncatedWidth = o._width;
    if (truncatedWidth + o._lineIndex > 4) {
      truncatedWidth = 4 - o._lineIndex;
    }

    return {
      id: uuid(),
      beatStart: o._time,
      beatDuration: o._duration,
      lane: o._lineIndex,
      type: o._type === 0 ? 'wall' : 'ceiling',
      colspan: truncatedWidth,
    };
  });
};

export const convertObstaclesToExportableJson = obstacles => {
  return obstacles.map(o => ({
    _time: o.beatStart,
    _duration: o.beatDuration === 0 ? 0.1 : o.beatDuration,
    _lineIndex: o.lane,
    _type: o.type === 'wall' ? 0 : 1,
    _width: o.colspan,
  }));
};

export const swapObstacles = (axis, obstacles) => {
  // There is no vertical equivalent to ceiling obstacles.
  // So, no work is necessary
  if (axis === 'vertical') {
    return obstacles;
  }

  return obstacles.map(obstacle => {
    if (!obstacle.selected) {
      return obstacle;
    }

    return {
      ...obstacle,
      lane: 3 - obstacle.lane,
    };
  });
};
