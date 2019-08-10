import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';

import { COLORS } from '../../constants';
import { normalize } from '../../utils';
import UnstyledButton from '../UnstyledButton';

const getBackgroundForEvent = event => {
  // prettier-ignore
  const color = event.color === 'red'
    ? COLORS.red[500]
    : event.color === 'blue'
      ? COLORS.blue[500]
      : COLORS.blueGray[400];

  switch (event.type) {
    case 'on':
    case 'off': {
      // On/off are solid colors
      return color;
    }

    case 'flash': {
      const semiTransparentColor = Color(color)
        .fade(0.5)
        .rgb();
      return `linear-gradient(90deg, ${semiTransparentColor}, ${color})`;
    }

    case 'fade': {
      const semiTransparentColor = Color(color)
        .fade(0.5)
        .rgb();
      return `linear-gradient(-90deg, ${semiTransparentColor}, ${color})`;
    }

    default:
      throw new Error('Unrecognized type: ' + event.type);
  }
};

const LightingOnBlock = ({
  event,
  startBeat,
  numOfBeatsToShow,
  ...delegated
}) => {
  const offset = normalize(
    event.beatNum,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    100
  );

  const background = getBackgroundForEvent(event);

  return (
    <Wrapper
      onContextMenu={ev => ev.preventDefault()}
      style={{ left: offset + '%', background }}
      {...delegated}
    >
      {event.selected && <SelectedGlow />}
    </Wrapper>
  );
};

const Wrapper = styled(UnstyledButton)`
  width: 7px;
  height: 100%;
  position: absolute;
  border-radius: 4px;
  transform: translateX(-50%);
`;

const SelectedGlow = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${COLORS.yellow[500]};
  border-radius: 4px;
  opacity: 0.6;
`;

export default connect(
  null,
  {}
)(React.memo(LightingOnBlock));
