import React from 'react';
import styled from 'styled-components';

import { UNIT, NOTES_VIEW } from '../../constants';

import EditorNavigationControls from '../EditorNavigationControls';
import EditorWaveform from '../EditorWaveform';
import EditorStatusBar from '../EditorStatusBar';

const PADDING = UNIT * 2;

const EditorBottomPanel = () => {
  // This is a known size because IconButton is always 36px squared, and it's
  // the tallest thing in this child.
  // TODO: Make this relationship explicit, share a constant or something
  const playbackControlsHeight = 36;
  const statusBarHeight = 30;

  const waveformHeight = 80;

  return (
    <Wrapper>
      <SubWrapper>
        <EditorNavigationControls
          height={playbackControlsHeight}
          view={NOTES_VIEW}
        />
      </SubWrapper>
      <SubWrapper>
        <EditorWaveform height={waveformHeight} />
      </SubWrapper>
      <EditorStatusBar height={statusBarHeight} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 179px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: ${PADDING}px;
  background: rgba(0, 0, 0, 0.45);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
`;
const SubWrapper = styled.div`
  position: relative;
  padding: ${PADDING}px;
  padding-top: 0;
`;

export default EditorBottomPanel;
