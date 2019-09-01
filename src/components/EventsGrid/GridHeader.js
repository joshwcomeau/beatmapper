import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import * as actions from '../../actions';

const GridHeader = ({ height, beatNums, selectedBeat, scrubEventsHeader }) => {
  const [isScrubbing, setIsScrubbing] = React.useState(false);
  const lastActionDispatchedFor = React.useRef(null);

  return (
    <Header
      style={{ height }}
      onPointerDown={() => {
        setIsScrubbing(true);
        scrubEventsHeader(selectedBeat);
        lastActionDispatchedFor.current = selectedBeat;
      }}
      onPointerUp={() => {
        setIsScrubbing(false);
        lastActionDispatchedFor.current = null;
      }}
      onPointerMove={() => {
        if (!isScrubbing) {
          return;
        }

        // If this is our very first scrub of this pointer-down, we should use
        // it by default.
        const shouldDispatchAction =
          lastActionDispatchedFor.current !== selectedBeat;

        if (shouldDispatchAction) {
          scrubEventsHeader(selectedBeat);
          lastActionDispatchedFor.current = selectedBeat;
        }
      }}
    >
      {beatNums.map(num => (
        <HeaderCell key={num}>
          <BeatNums>{num}</BeatNums>
        </HeaderCell>
      ))}
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLORS.blueGray[500]};
  cursor: col-resize;
`;

const HeaderCell = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
`;

const BeatNums = styled.span`
  display: inline-block;
  transform: translateX(-50%);
  padding-bottom: 8px;

  ${HeaderCell}:first-of-type & {
    display: none;
  }
`;

const mapDispatchToProps = {
  scrubEventsHeader: actions.scrubEventsHeader,
};

export default connect(
  null,
  mapDispatchToProps
)(GridHeader);
