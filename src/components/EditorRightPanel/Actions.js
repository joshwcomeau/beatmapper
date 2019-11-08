import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

import * as actions from '../../actions';
import { UNIT, NOTES_VIEW } from '../../constants';
import { getMetaKeyLabel } from '../../utils';
import {
  promptQuickSelect,
  promptJumpToBeat,
} from '../../helpers/prompts.helpers';

import MiniButton from '../MiniButton';
import Heading from '../Heading';
import Spacer from '../Spacer';
import {
  getCanUndo,
  getCanRedo,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { getHasCopiedNotes } from '../../reducers/clipboard.reducer';

const ACTION_WIDTH = 110;
const HALF_ACTION_WIDTH = ACTION_WIDTH / 2 - UNIT / 2;

const Actions = ({
  canUndo,
  canRedo,
  hasCopiedNotes,
  selectAllInRange,
  jumpToBeat,
  undoNotes,
  redoNotes,
  pasteSelection,
}) => {
  return (
    <Wrapper>
      <Heading size={3}>Actions</Heading>
      <Spacer size={UNIT * 1.5} />

      <Row>
        <Tooltip delay={[1000, 0]} title={`(${getMetaKeyLabel()} + Z)`}>
          <MiniButton
            width={HALF_ACTION_WIDTH}
            disabled={!canUndo}
            onClick={undoNotes}
          >
            Undo
          </MiniButton>
        </Tooltip>
        <Spacer size={UNIT} />
        <Tooltip delay={[1000, 0]} title={`(Shift + ${getMetaKeyLabel()} + Z)`}>
          <MiniButton
            width={HALF_ACTION_WIDTH}
            disabled={!canRedo}
            onClick={redoNotes}
          >
            Redo
          </MiniButton>
        </Tooltip>
      </Row>

      <Spacer size={UNIT} />

      <Tooltip
        delay={[1000, 0]}
        title={`Paste previously-copied notes (${getMetaKeyLabel()} + V)`}
      >
        <MiniButton
          disabled={!hasCopiedNotes}
          width={ACTION_WIDTH}
          onClick={() => pasteSelection(NOTES_VIEW)}
        >
          Paste Selection
        </MiniButton>
      </Tooltip>

      <Spacer size={UNIT} />

      <Tooltip
        delay={[1000, 0]}
        title="Select everything over a time period (Q)"
      >
        <MiniButton
          width={ACTION_WIDTH}
          onClick={() => promptQuickSelect(NOTES_VIEW, selectAllInRange)}
        >
          Quick-select
        </MiniButton>
      </Tooltip>

      <Spacer size={UNIT} />

      <Tooltip delay={[1000, 0]} title="Jump to a specific beat number (J)">
        <MiniButton
          width={ACTION_WIDTH}
          onClick={() => promptJumpToBeat(jumpToBeat, true)}
        >
          Jump to Beat
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

const mapStateToProps = state => {
  return {
    canUndo: getCanUndo(state),
    canRedo: getCanRedo(state),
    hasCopiedNotes: getHasCopiedNotes(state),
  };
};

const mapDispatchToProps = {
  selectAllInRange: actions.selectAllInRange,
  jumpToBeat: actions.jumpToBeat,
  undoNotes: actions.undoNotes,
  redoNotes: actions.redoNotes,
  pasteSelection: actions.pasteSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Actions);
