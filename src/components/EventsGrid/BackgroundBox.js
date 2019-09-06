import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';

import { COLORS } from '../../constants';
import * as actions from '../../actions';
import { getSelectedEventEditMode } from '../../reducers/editor.reducer';
import { normalize } from '../../utils';
import UnstyledButton from '../UnstyledButton';

const BackgroundBox = ({ box, color = 'red', startBeat, numOfBeatsToShow }) => {
  const startOffset = normalize(
    box.beatNum,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    100
  );
  const width = normalize(
    box.duration,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    100
  );

  return (
    <Wrapper
      style={{ left: startOffset + '%', width: width + '%', background: color }}
    />
  );
};

const Wrapper = styled.div`
  height: 100%;
  position: absolute;
  opacity: 0.2;
`;

export default BackgroundBox;
