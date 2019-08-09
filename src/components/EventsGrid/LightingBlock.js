import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import { normalize } from '../../utils';

const LightingOnBlock = ({ event, startBeat, numOfBeatsToShow }) => {
  const offset = normalize(
    event.beatNum,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    100
  );

  const color =
    event.color === 'red'
      ? COLORS.red[500]
      : event.color === 'blue'
      ? COLORS.blue[500]
      : COLORS.blueGray[400];

  return <Wrapper style={{ left: offset + '%', backgroundColor: color }} />;
};

const Wrapper = styled.div`
  width: 10px;
  height: 100%;
  position: absolute;
  border-radius: 4px;
  transform: translateX(-50%);
`;

export default connect(
  null,
  {}
)(React.memo(LightingOnBlock));
