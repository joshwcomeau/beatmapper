import React from 'react';
import { connect } from 'react-redux';
import { useSpring, a } from 'react-spring/three';

import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

const TrackMover = ({
  cursorPositionInBeats,
  beatDepth,
  animateBlockMotion,
  children,
}) => {
  const zPosition = cursorPositionInBeats * beatDepth;

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
    beatDepth: getBeatDepth(state),
    animateBlockMotion: state.navigation.animateBlockMotion,
  };
};

export default connect(mapStateToProps)(TrackMover);
