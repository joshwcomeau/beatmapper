import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { maximize2 as swapIcon } from 'react-icons-kit/feather/maximize2';
import { arrowUp } from 'react-icons-kit/feather/arrowUp';
import { arrowDown } from 'react-icons-kit/feather/arrowDown';
import { Tooltip } from 'react-tippy';

import * as actions from '../../actions';
import { COLORS, UNIT, NOTES_VIEW } from '../../constants';
import { getMetaKeyLabel } from '../../utils';

import MiniButton from '../MiniButton';
import Heading from '../Heading';
import IconButton from '../IconButton';
import Spacer from '../Spacer';

import ObstacleTweaks from './ObstacleTweaks';

const SelectionCount = ({ num, label }) => {
  const pluralizedLabel = num === 1 ? label : `${label}s`;

  return (
    <>
      <Highlight>{num}</Highlight> {pluralizedLabel}
    </>
  );
};

const SelectionInfo = ({
  numOfSelectedNotes,
  numOfSelectedObstacles,
  deselectAll,
  swapSelectedNotes,
  nudgeSelection,
}) => {
  const shouldShowObstacleTweaks =
    numOfSelectedObstacles === 1 && numOfSelectedNotes === 0;

  let numbers = [];
  if (numOfSelectedNotes) {
    numbers.push(
      <SelectionCount key="notes" num={numOfSelectedNotes} label="note" />
    );
  }
  if (numOfSelectedObstacles) {
    numbers.push(
      <SelectionCount
        key="obstacles"
        num={numOfSelectedObstacles}
        label="wall"
      />
    );
  }

  if (numbers.length === 2) {
    numbers = [numbers[0], ', ', numbers[1]];
  }

  const metaKeyLabel = getMetaKeyLabel();

  return (
    <Wrapper>
      <Heading size={3}>Selection</Heading>
      <Spacer size={UNIT * 1.5} />

      <div>{numbers}</div>

      <Spacer size={UNIT * 4} />

      {shouldShowObstacleTweaks && (
        <>
          <Heading size={3}>Selected Wall</Heading>
          <Spacer size={UNIT * 1.5} />
          <ObstacleTweaks />
          <Spacer size={UNIT * 4} />
        </>
      )}

      <Heading size={3}>Actions</Heading>
      <Spacer size={UNIT * 1.5} />

      <Row>
        <Tooltip delay={[500, 0]} title="Swap horizontally (H)">
          <IconButton
            rotation={45}
            icon={swapIcon}
            onClick={() => swapSelectedNotes('horizontal')}
          />
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip delay={[500, 0]} title="Swap vertically (V)">
          <IconButton
            rotation={-45}
            icon={swapIcon}
            onClick={() => swapSelectedNotes('vertical')}
          />
        </Tooltip>
      </Row>
      <Spacer size={UNIT} />
      <Row>
        <Tooltip
          delay={[500, 0]}
          title={`Nudge forwards (${metaKeyLabel} + ↑)`}
        >
          <IconButton
            icon={arrowUp}
            onClick={() => nudgeSelection('forwards', NOTES_VIEW)}
          />
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip
          delay={[500, 0]}
          title={`Nudge backwards (${metaKeyLabel} + ↓)`}
        >
          <IconButton
            icon={arrowDown}
            onClick={() => nudgeSelection('backwards', NOTES_VIEW)}
          />
        </Tooltip>
      </Row>
      <Spacer size={UNIT * 2} />
      <MiniButton onClick={() => deselectAll(NOTES_VIEW)}>Deselect</MiniButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
`;

const Highlight = styled.span`
  color: ${COLORS.yellow[500]};
`;

const mapDispatchToProps = {
  deselectAll: actions.deselectAll,
  swapSelectedNotes: actions.swapSelectedNotes,
  nudgeSelection: actions.nudgeSelection,
};

export default connect(
  null,
  mapDispatchToProps
)(SelectionInfo);
