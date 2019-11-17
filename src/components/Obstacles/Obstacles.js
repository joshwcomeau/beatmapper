import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSurfaceDepth } from '../../constants';
import { getColorForItem } from '../../helpers/colors.helpers';
import {
  getCursorPositionInBeats,
  getSnapTo,
  getBeatDepth,
} from '../../reducers/navigation.reducer';
import { getObstacles } from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import ObstacleBox from '../ObstacleBox';
import { getGraphicsLevel } from '../../reducers/user.reducer';

const Obstacles = ({
  song,
  obstacles,
  cursorPositionInBeats,
  beatDepth,
  selectionMode,
  snapTo,
  graphicsLevel,
  deleteObstacle,
  resizeObstacle,
  selectObstacle,
  deselectObstacle,
}) => {
  // Show only the obstacles that fit atop the platform.
  const surfaceDepth = getSurfaceDepth(graphicsLevel);

  const farLimit = surfaceDepth / beatDepth;
  const closeLimit = (surfaceDepth / beatDepth) * 0.2;

  const visibleObstacles = obstacles.filter(obstacle => {
    const beatEnd = obstacle.beatStart + obstacle.beatDuration;
    return (
      beatEnd > cursorPositionInBeats - closeLimit &&
      obstacle.beatStart < cursorPositionInBeats + farLimit
    );
  });

  const obstacleColor = getColorForItem('obstacle', song);

  return visibleObstacles.map(obstacle => (
    <ObstacleBox
      key={obstacle.id}
      obstacle={obstacle}
      color={obstacleColor}
      beatDepth={beatDepth}
      snapTo={snapTo}
      handleDelete={deleteObstacle}
      handleResize={resizeObstacle}
      handleClick={() =>
        obstacle.selected
          ? deselectObstacle(obstacle.id)
          : selectObstacle(obstacle.id)
      }
      handleMouseOver={() => {
        if (selectionMode === 'select' && !obstacle.selected) {
          selectObstacle(obstacle.id);
        } else if (selectionMode === 'deselect' && obstacle.selected) {
          deselectObstacle(obstacle.id);
        } else if (selectionMode === 'delete') {
          deleteObstacle(obstacle.id);
        }
      }}
    />
  ));
};

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
    obstacles: getObstacles(state),
    cursorPositionInBeats: getCursorPositionInBeats(state),
    beatDepth: getBeatDepth(state),
    graphicsLevel: getGraphicsLevel(state),
    selectionMode: state.editor.notes.selectionMode,
    snapTo: getSnapTo(state),
  };
};

const mapDispatchToProps = {
  deleteObstacle: actions.deleteObstacle,
  resizeObstacle: actions.resizeObstacle,
  selectObstacle: actions.selectObstacle,
  deselectObstacle: actions.deselectObstacle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Obstacles);
