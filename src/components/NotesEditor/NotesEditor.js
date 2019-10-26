import React from 'react';
import styled from 'styled-components';

import ReduxForwardingCanvas from '../ReduxForwardingCanvas';
import MapVisualization from '../MapVisualization';
import EditorBottomPanel from '../EditorBottomPanel';
import EditorRightPanel from '../EditorRightPanel';
import SongInfo from '../SongInfo';
import GlobalShortcuts from '../GlobalShortcuts';

import KeyboardShortcuts from './KeyboardShortcuts';
import { NOTES_VIEW } from '../../constants';

const NotesEditor = () => {
  return (
    <Wrapper>
      <SongInfo showDifficultySelector />

      <ReduxForwardingCanvas>
        <MapVisualization />
      </ReduxForwardingCanvas>

      <EditorBottomPanel />
      <EditorRightPanel />

      <GlobalShortcuts view={NOTES_VIEW} />
      <KeyboardShortcuts />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
`;

export default NotesEditor;
