import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UNIT } from '../../constants';
import { getNumOfSelectedNotes } from '../../reducers/editor-entities.reducer/notes-view.reducer';

import NoteGrid from '../NoteGrid';
import ItemGrid from '../ItemGrid';
import SelectionInfo from '../SelectionInfo';
import Spacer from '../Spacer';

import Actions from './Actions';

// HACK: This should be a constant somewhere, used to set bottom panel
// height!
const bottomPanelHeight = 180;

const EditorRightPanel = ({ numOfSelectedItems }) => {
  const panelContents =
    numOfSelectedItems === 0 ? (
      <>
        <NoteGrid />
        <Spacer size={UNIT * 4} />
        <ItemGrid />
        <Spacer size={UNIT * 4} />
        <Actions />
      </>
    ) : (
      <>
        <SelectionInfo />
      </>
    );

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

const mapStateToProps = state => ({
  numOfSelectedItems: getNumOfSelectedNotes(state),
});

export default connect(mapStateToProps)(EditorRightPanel);
