import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { SURFACE_DEPTH } from '../../constants';
import { getColorForItem } from '../../helpers/colors.helpers';
import {
  getCursorPositionInBeats,
  getSnapTo,
  getBeatDepth,
} from '../../reducers/navigation.reducer';
import { getObstacles } from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { getSelectedSong, getGridSize } from '../../reducers/songs.reducer';

import ObstacleBox from '../ObstacleBox';

const Obstacles = ({
  song,
  obstacles,
  cursorPositionInBeats,
  beatDepth,
  selectionMode,
  snapTo,
  deleteObstacle,
  resizeObstacle,
  selectObstacle,
  deselectObstacle,
}) => {
  // Show only the obstacles that fit atop the platform.
  const farLimit = SURFACE_DEPTH / beatDepth;
  const closeLimit = (SURFACE_DEPTH / beatDepth) * 0.2;
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
