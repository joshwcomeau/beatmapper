import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { PREVIEW_VIEW } from '../../constants';
import useScrollThroughSong from '../../hooks/use-scroll-through-song.hook';

import ReduxForwardingCanvas from '../ReduxForwardingCanvas';
import EditorBottomPanel from '../EditorBottomPanel';

// import KeyboardShortcuts from './KeyboardShortcuts';
import LightingPreview from './LightingPreview';
import GlobalShortcuts from '../GlobalShortcuts';

const Preview = ({ isPlaying, scrollThroughSong }) => {
  const canvasRef = React.useRef(null);

  useScrollThroughSong(canvasRef, isPlaying, scrollThroughSong);

  return (
    <Wrapper>
      <ReduxForwardingCanvas ref={canvasRef}>
        <LightingPreview />
      </ReduxForwardingCanvas>

      <EditorBottomPanel />

      <GlobalShortcuts view={PREVIEW_VIEW} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
`;

const mapStateToProps = state => ({
  isPlaying: state.navigation.isPlaying,
});

const mapDispatchToProps = {
  scrollThroughSong: actions.scrollThroughSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preview);
