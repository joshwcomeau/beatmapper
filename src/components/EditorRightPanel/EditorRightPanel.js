import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UNIT } from '../../constants';
import {
  getSelectedNotes,
  getSelectedObstacles,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';

import NoteGrid from '../NoteGrid';
import ItemGrid from '../ItemGrid';
import SelectionInfo from '../SelectionInfo';
import Spacer from '../Spacer';

import Actions from './Actions';
import GridConfig from './GridConfig';

// HACK: This should be a constant somewhere, used to set bottom panel
// height!
const bottomPanelHeight = 180;

const EditorRightPanel = ({
  numOfSelectedNotes,
  numOfSelectedObstacles,
  isAnythingSelected,
}) => {
  // This panel adapts based on the current situation.
  let panelContents;

  const [showGridConfig, setShowGridConfig] = React.useState(false);

  if (showGridConfig) {
    panelContents = <GridConfig />;
  } else if (isAnythingSelected) {
    panelContents = (
      <SelectionInfo
        numOfSelectedNotes={numOfSelectedNotes}
        numOfSelectedObstacles={numOfSelectedObstacles}
      />
    );
  } else {
    panelContents = (
      <>
        <NoteGrid />
        <Spacer size={UNIT * 4} />
        <ItemGrid />
        <Spacer size={UNIT * 4} />
        <Actions handleGridConfigClick={() => setShowGridConfig(true)} />
      </>
    );
  }

  return (
    <OuterWrapper>
      <Wrapper>{panelContents}</Wrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: ${bottomPanelHeight}px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Wrapper = styled.div`
  color: #fff;
  padding: ${UNIT * 4}px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: ${UNIT}px 0 0 ${UNIT}px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  overflow: auto;
`;

const mapStateToProps = state => {
  const selectedNotes = getSelectedNotes(state);
  const selectedObstacles = getSelectedObstacles(state);

  const isAnythingSelected =
    selectedNotes.length > 0 || selectedObstacles.length > 0;

  return {
    numOfSelectedNotes: selectedNotes.length,
    numOfSelectedObstacles: selectedObstacles.length,
    isAnythingSelected,
  };
};

export default connect(mapStateToProps)(EditorRightPanel);
