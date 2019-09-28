import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { COLORS, UNIT } from '../../constants';
import { getSelectedObstacles } from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { promptChangeObstacleDuration } from '../../helpers/prompts.helpers';

import Spacer from '../Spacer';
import MiniButton from '../MiniButton';

const ObstacleTweaks = ({ obstacle, resizeObstacle }) => {
  // We want to let the user tweak the duration of the obstacle
  const beatNoun = obstacle.beatDuration === 1 ? 'beat' : 'beats';

  return (
    <>
      <div>
        Duration: <Highlight>{obstacle.beatDuration}</Highlight> {beatNoun}
      </div>
      <Spacer size={UNIT * 1.5} />
      <MiniButton
        onClick={() => promptChangeObstacleDuration(obstacle, resizeObstacle)}
      >
        Change duration
      </MiniButton>
    </>
  );
};

const Highlight = styled.span`
  color: ${COLORS.yellow[500]};
`;

const mapStateToProps = state => {
  const selectedObstacles = getSelectedObstacles(state);

  if (selectedObstacles.length !== 1) {
    throw new Error(
      'ObstacleTweaks is rendered with an incorrect number of selected obstacles. Expected 1, got ' +
        selectedObstacles.length
    );
  }

  const [obstacle] = selectedObstacles;

  return { obstacle };
};

const mapDispatchToProps = { resizeObstacle: actions.resizeObstacle };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObstacleTweaks);
