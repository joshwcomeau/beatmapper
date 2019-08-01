import React from 'react';
import { connect } from 'react-redux';
import { useSpring, a } from 'react-spring/three';

import { BEAT_DEPTH } from '../../constants';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

const TrackMover = ({
  cursorPositionInBeats,
  animateBlockMotion,
  children,
}) => {
  const zPosition = cursorPositionInBeats * BEAT_DEPTH;

  const spring = useSpring({ zPosition, immediate: !animateBlockMotion });

  return (
    <a.group
      position={spring.zPosition.interpolate(interpolated => [
        0,
        0,
        interpolated,
      ])}
    >
      {children}
    </a.group>
  );
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);

  return {
    cursorPositionInBeats: getCursorPositionInBeats(state, song.bpm),
    animateBlockMotion: state.navigation.animateBlockMotion,
  };
};

export default connect(mapStateToProps)(TrackMover);
