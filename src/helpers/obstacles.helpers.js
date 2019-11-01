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

export const nudgeObstacles = (direction, amount, obstacles) => {
  const sign = direction === 'forwards' ? 1 : -1;

  return obstacles.map(obstacle => {
    if (!obstacle.selected) {
      return obstacle;
    }

    return {
      ...obstacle,
      beatStart: obstacle.beatStart + amount * sign,
    };
  });
};

export const createObstacleFromMouseEvent = (
  mode,
  mouseDownAt,
  mouseOverAt,
  beatStart,
  beatDuration = 4
) => {
  const lane = Math.min(mouseDownAt.colIndex, mouseOverAt.colIndex);

  const colspan = Math.abs(mouseDownAt.colIndex - mouseOverAt.colIndex) + 1;

  // prettier-ignore
  const obstacleType = mode === 'with-mapping-extensions'
    ? 'extension'
    : mouseOverAt.rowIndex === 2
      ? 'ceiling'
      : 'wall'

  const obstacle = {
    lane,
    type: obstacleType,
    beatStart,
    beatDuration,
    colspan,
  };

  // 'original' walls need to be clamped, to not cause hazards
  if (mode === 'original') {
    if (obstacle.type === 'wall' && obstacle.colspan > 2) {
      const overBy = obstacle.colspan - 2;
      obstacle.colspan = 2;

      const colspanDelta = mouseOverAt.colIndex - mouseDownAt.colIndex;

      if (colspanDelta > 0) {
        obstacle.lane += overBy;
      } else {
        obstacle.lane = mouseOverAt.colIndex;
      }
    }
  } else if (mode === 'with-mapping-extensions') {
    // For mapping extensions, things work a little bit differently.
    // We need a rowIndex, which works like `lane`, and rowspan, which works
    // like `colspan`
    const rowIndex = Math.min(mouseDownAt.rowIndex, mouseOverAt.rowIndex);
    const rowspan = Math.abs(mouseDownAt.rowIndex - mouseOverAt.rowIndex) + 1;

    obstacle.rowIndex = rowIndex;
    obstacle.rowspan = rowspan;
  }

  return obstacle;
};
