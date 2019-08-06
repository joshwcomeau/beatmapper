import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import { normalize } from '../../utils';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';

const CursorPositionIndicator = ({
  gridWidth,
  cursorPositionInBeats,
  startBeat,
  endBeat,
}) => {
  const cursorOffsetInWindow = normalize(
    cursorPositionInBeats,
    startBeat,
    endBeat,
    0,
    gridWidth
  );

  return (
    <Elem
      style={{
        transform: `translateX(${cursorOffsetInWindow}px)`,
      }}
    />
  );
};

const Elem = styled.div`
  position: absolute;
  top: 0;
  left: -1.5px;
  z-index: 5;
  width: 3px;
  height: 100%;
  background: ${COLORS.yellow[500]};
  border-radius: 4px;
  pointer-events: none;
`;

const mapStateToProps = state => {
  return {
    cursorPositionInBeats: getCursorPositionInBeats(state),
  };
};

export default connect(mapStateToProps)(CursorPositionIndicator);
