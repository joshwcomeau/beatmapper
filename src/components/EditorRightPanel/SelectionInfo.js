import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { maximize2 as swapIcon } from 'react-icons-kit/feather/maximize2';
import { arrowUp } from 'react-icons-kit/feather/arrowUp';
import { arrowDown } from 'react-icons-kit/feather/arrowDown';
import { Tooltip } from 'react-tippy';

import * as actions from '../../actions';
import { COLORS, UNIT, NOTES_VIEW } from '../../constants';
import { getHasCopiedNotes } from '../../reducers/clipboard.reducer';
import { getMetaKeyLabel, interleave } from '../../utils';
import { ACTION_WIDTH, HALF_ACTION_WIDTH } from './EditorRightPanel.constants';

import MiniButton from '../MiniButton';
import Heading from '../Heading';
import IconButton from '../IconButton';
import Spacer from '../Spacer';
import UnstyledButton from '../UnstyledButton';
import StrikethroughOnHover from '../StrikethroughOnHover';
import ObstacleTweaks from './ObstacleTweaks';
import UndoRedo from './UndoRedo';

const SelectionCount = ({ num, label, onClick }) => {
  const pluralizedLabel = num === 1 ? label : `${label}s`;

  return (
    <UnstyledButton display="inline" onClick={onClick}>
      <StrikethroughOnHover>
        <Highlight>{num}</Highlight> {pluralizedLabel}
      </StrikethroughOnHover>
    </UnstyledButton>
  );
};

const SelectionInfo = ({
  numOfSelectedBlocks,
  numOfSelectedMines,
  numOfSelectedObstacles,
  hasCopiedNotes,
  deselectAll,
  swapSelectedNotes,
  nudgeSelection,
  cutSelection,
  copySelection,
  pasteSelection,
  deselectAllOfType,
}) => {
  const hasSelectedObstacles = numOfSelectedObstacles >= 1;

  let numbers = [];
  if (numOfSelectedBlocks) {
    numbers.push(
      <SelectionCount
        key="blocks"
        num={numOfSelectedBlocks}
        label="block"
        onClick={() => deselectAllOfType('block')}
      />
    );
  }
  if (numOfSelectedMines) {
    numbers.push(
      <SelectionCount
        key="mines"
        num={numOfSelectedMines}
        label="mine"
        onClick={() => deselectAllOfType('mine')}
      />
    );
  }
  if (numOfSelectedObstacles) {
    numbers.push(
      <SelectionCount
        key="obstacles"
        num={numOfSelectedObstacles}
        label="wall"
        onClick={() => deselectAllOfType('obstacle')}
      />
    );
  }

  numbers = interleave(numbers, ', ');

  const metaKeyLabel = getMetaKeyLabel();

  return (
    <Wrapper>
      <Heading size={3}>Selection</Heading>
      <Spacer size={UNIT * 1.5} />

      <div>{numbers}</div>

      <Spacer size={UNIT * 4} />

      {hasSelectedObstacles && (
        <>
          <ObstacleTweaks />
          <Spacer size={UNIT * 4} />
        </>
      )}

      <Heading size={3}>Actions</Heading>
      <Spacer size={UNIT * 1.5} />

      <Row>
        <Tooltip delay={[1000, 0]} title="Swap horizontally (H)">
          <IconButton
            rotation={45}
            icon={swapIcon}
            onClick={() => swapSelectedNotes('horizontal')}
          />
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip delay={[1000, 0]} title="Swap vertically (V)">
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
          delay={[1000, 0]}
          title={`Nudge forwards (${metaKeyLabel} + ↑)`}
        >
          <IconButton
            icon={arrowUp}
            onClick={() => nudgeSelection('forwards', NOTES_VIEW)}
          />
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip
          delay={[1000, 0]}
          title={`Nudge backwards (${metaKeyLabel} + ↓)`}
        >
          <IconButton
            icon={arrowDown}
            onClick={() => nudgeSelection('backwards', NOTES_VIEW)}
          />
        </Tooltip>
      </Row>

      <Spacer size={UNIT * 2} />

      <Tooltip delay={[1000, 0]} title="Clear selection (Escape)">
        <MiniButton
          width={ACTION_WIDTH}
          onClick={() => deselectAll(NOTES_VIEW)}
        >
          Deselect
        </MiniButton>
      </Tooltip>
      <Spacer size={UNIT * 2} />

      <UndoRedo />

      <Spacer size={UNIT * 2} />

      <Row>
        <Tooltip
          delay={[1000, 0]}
          title={`copy and remove selection (${getMetaKeyLabel()} + X)`}
        >
          <MiniButton
            width={HALF_ACTION_WIDTH}
            onClick={() => cutSelection(NOTES_VIEW)}
          >
            Cut
          </MiniButton>
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip
          delay={[1000, 0]}
          title={`Copy selection (${getMetaKeyLabel()} + C)`}
        >
          <MiniButton
            width={HALF_ACTION_WIDTH}
            onClick={() => copySelection(NOTES_VIEW)}
          >
            Copy
          </MiniButton>
        </Tooltip>
      </Row>

      <Spacer size={UNIT} />

      <Tooltip
        delay={[1000, 0]}
        title={`Paste copied notes and obstacles (${getMetaKeyLabel()} + V)`}
      >
        <MiniButton
          width={ACTION_WIDTH}
          disabled={!hasCopiedNotes}
          onClick={() => pasteSelection(NOTES_VIEW)}
        >
          Paste
        </MiniButton>
      </Tooltip>
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

const mapStateToProps = state => {
  return {
    hasCopiedNotes: getHasCopiedNotes(state),
  };
};

const mapDispatchToProps = {
  deselectAll: actions.deselectAll,
  swapSelectedNotes: actions.swapSelectedNotes,
  nudgeSelection: actions.nudgeSelection,
  cutSelection: actions.cutSelection,
  copySelection: actions.copySelection,
  pasteSelection: actions.pasteSelection,
  deselectAllOfType: actions.deselectAllOfType,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionInfo);
