import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { isMetaKeyPressed } from '../../utils';
import useMousewheel from '../../hooks/use-mousewheel.hook';

import ReduxForwardingCanvas from '../ReduxForwardingCanvas';
import MapVisualization from '../MapVisualization';
import EditorBottomPanel from '../EditorBottomPanel';
import EditorRightPanel from '../EditorRightPanel';
import HelpButton from '../HelpButton';
import SongInfo from '../SongInfo';

import KeyboardShortcuts from './KeyboardShortcuts';

const NotesEditor = ({ isPlaying, pausePlaying, scrollThroughSong }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      // On unmount, pause the track
      pausePlaying();
    };
  }, [pausePlaying]);

  useMousewheel(canvasRef, true, ev => {
    // Ignore mousewheels when the ctrl key is held.
    // Those mousewheel events will be captured above, for changing the
    // snapping.
    if (isMetaKeyPressed(ev)) {
      return;
    }

    ev.preventDefault();

    const direction = ev.deltaY < 0 ? 'forwards' : 'backwards';

    if (!isPlaying) {
      scrollThroughSong(direction);
    }
  });

  return (
    <Wrapper>
      <SongInfo />

      <ReduxForwardingCanvas ref={canvasRef}>
        <MapVisualization />
      </ReduxForwardingCanvas>

      <HelpButton />

      <EditorBottomPanel />
      <EditorRightPanel />

      <KeyboardShortcuts />
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
  pausePlaying: actions.pausePlaying,
  scrollThroughSong: actions.scrollThroughSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesEditor);
