import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';
import useWindowDimensions from '../../hooks/use-window-dimensions.hook';

import NoteGrid from '../NoteGrid';
import ItemGrid from '../ItemGrid';
import SelectionInfo from '../SelectionInfo';
import Spacer from '../Spacer';

const EditorRightPanel = () => {
  const windowDimensions = useWindowDimensions();

  let panelHeight = 520;
  // HACK: This should be a constant somewhere, used to set bottom panel
  // height!
  const bottomPanelHeight = 180;

  const availableSpace =
    windowDimensions.height - bottomPanelHeight - panelHeight;

  const top = Math.max(0, availableSpace / 2);

  if (availableSpace < 0) {
    panelHeight = panelHeight + availableSpace;
  }

  return (
    <Wrapper style={{ height: panelHeight, top }}>
      <NoteGrid />
      <Spacer size={UNIT * 4} />
      <ItemGrid />
      <Spacer size={UNIT * 4} />
      <SelectionInfo />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  width: 200px; /* TODO: vw? */
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

export default EditorRightPanel;
