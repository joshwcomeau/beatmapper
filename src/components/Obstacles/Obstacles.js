import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getColorForItem } from '../../helpers/colors.helpers';
import { getSnapTo, getBeatDepth } from '../../reducers/navigation.reducer';
import { getVisibleObstacles } from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import ObstacleBox from '../ObstacleBox';

const Obstacles = ({
  song,
  obstacles,
  beatDepth,
  selectionMode,
  snapTo,
  deleteObstacle,
  resizeObstacle,
  selectObstacle,
  deselectObstacle,
}) => {
  const obstacleColor = getColorForItem('obstacle', song);

  return obstacles.map(obstacle => (
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
    obstacles: getVisibleObstacles(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Obstacles);
