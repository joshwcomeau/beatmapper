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
  return <Wrapper style={{ left: offset + '%' }} />;
};

const Wrapper = styled.div`
  width: 10px;
  height: 100%;
  background: red;
  position: absolute;
`;

export default connect(
  null,
  {}
)(React.memo(LightingOnBlock));
