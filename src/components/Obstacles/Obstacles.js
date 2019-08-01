import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import {
  getCursorPositionInBeats,
  getSnapTo,
} from '../../reducers/navigation.reducer';
import { getObstacles } from '../../reducers/editor-entities.reducer';

import ObstacleBox from '../ObstacleBox';

const Obstacles = ({
  obstacles,
  cursorPositionInBeats,
  selectionMode,
  snapTo,
  deleteObstacle,
  resizeObstacle,
  selectObstacle,
  deselectObstacle,
}) => {
  return obstacles.map(obstacle => (
    <ObstacleBox
      key={obstacle.id}
      obstacle={obstacle}
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
    obstacles: getObstacles(state),
    cursorPositionInBeats: getCursorPositionInBeats(state),
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
