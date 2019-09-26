import React from 'react';
import { connect } from 'react-redux';
import { useSpring, a } from 'react-spring/three';

import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../../reducers/navigation.reducer';

const TrackMover = ({
  cursorPositionInBeats,
  beatDepth,
  animateBlockMotion,
  children,
}) => {
  const zPosition = cursorPositionInBeats * beatDepth;

  const spring = useSpring({
    zPosition,
    immediate: !animateBlockMotion,
    config: {
      tension: 360,
      friction: 22,
      mass: 0.4,
    },
  });

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
  return {
    cursorPositionInBeats: getCursorPositionInBeats(state),
    beatDepth: getBeatDepth(state),
    animateBlockMotion: state.navigation.animateBlockMotion,
  };
};

export default connect(mapStateToProps)(TrackMover);
