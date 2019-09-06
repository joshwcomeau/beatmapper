import React from 'react';
import styled from 'styled-components';

import { normalize } from '../../utils';

const BackgroundBox = ({ box, startBeat, numOfBeatsToShow }) => {
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
      style={{
        left: startOffset + '%',
        width: width + '%',
        background: box.color,
      }}
    />
  );
};

const Wrapper = styled.div`
  height: 100%;
  position: absolute;
  opacity: 0.2;
`;

export default BackgroundBox;
