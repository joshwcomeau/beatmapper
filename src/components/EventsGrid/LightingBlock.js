import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import { normalize } from '../../utils';

const getBackgroundForEventType = (type, color) => {
  switch (type) {
    case 'on':
    case 'off': {
      // On/off are solid colors
      return color;
    }

    case 'flash': {
      return color;
    }

    default:
      throw new Error('Unrecognized type: ' + type);
  }
};

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

  const background = event;

  return <Wrapper style={{ left: offset + '%', backgroundColor: color }} />;
};

const Wrapper = styled.div`
  width: 7px;
  height: 100%;
  position: absolute;
  border-radius: 4px;
  transform: translateX(-50%);
`;

export default connect(
  null,
  {}
)(React.memo(LightingOnBlock));
