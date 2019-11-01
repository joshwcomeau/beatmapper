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
  return obstacles.map(o => {
    // Normally, type is either 0 or 1, for walls or ceilings.
    // With Mapping Extensions, type type is used to control both height and
    // y position @_@
    //
    // We can tell if we're managing a MapEx wall by the `type`.
    //
    // It works according to this formula:
    //    wallHeight * 1000 + startHeight + 4001

    let type;
    switch (o.type) {
      case 'wall': {
        type = 0;
        break;
      }
      case 'ceiling': {
        type = 1;
        break;
      }
      case 'extension': {
        // `wallHeight` is a value from 1000 to 4000:
        // - 1000 is flat
        // - 2000 is normal height (which I think is like 4 rows?)
        // - 4000 is max
        //
        // So, first we need to normalize our rowIndex to be relative to the
        // normal scale (where 0 is no height and 1 is 4 rows height, so that a
        // 6-row-high wall is 1.5), and then I can normalize THAT value between
        // 1000 and 2000.
        //
        // TODO
      }

      default:
        throw new Error('Unrecognized type: ' + type);
    }

    return {
      _time: o.beatStart,
      _duration: o.beatDuration === 0 ? 0.1 : o.beatDuration,
      _lineIndex: o.lane,
      _type: o.type === 'wall' ? 0 : 1,
      _width: o.colspan,
    };
  });
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
  const obstacleType = mode === 'mapping-extensions'
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
  } else if (mode === 'mapping-extensions') {
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
