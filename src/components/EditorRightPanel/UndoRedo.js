import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getMetaKeyLabel } from '../../utils';
import {
  getCanUndo,
  getCanRedo,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';

import MiniButton from '../MiniButton';
import Spacer from '../Spacer';

import { HALF_ACTION_WIDTH } from './EditorRightPanel.constants';

const UndoRedo = ({ canUndo, canRedo, undoNotes, redoNotes }) => {
  return (
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
  );
};

const Row = styled.div`
  display: flex;
`;

const mapStateToProps = state => {
  return {
    canUndo: getCanUndo(state),
    canRedo: getCanRedo(state),
  };
};

const mapDispatchToProps = {
  undoNotes: actions.undoNotes,
  redoNotes: actions.redoNotes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo);
