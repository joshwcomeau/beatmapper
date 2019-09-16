import React from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring/three';

import { LASER_COLORS } from '../../constants';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getCursorPosition } from '../../reducers/navigation.reducer';
import { getEventForTrackAtBeat } from '../../reducers/editor-entities.reducer/events-view.reducer';
import useOnChange from '../../hooks/use-on-change.hook';
import { getSpringConfigForLight } from './Preview.helpers';

import RectAreaLight from '../RectAreaLight';
import LaserBeam from './LaserBeam';
import Glow from './Glow';

const ON_PROPS = { emissiveIntensity: 0.75, opacity: 0.75 };
const OFF_PROPS = { emissiveIntensity: 0, opacity: 0.5 };
const BRIGHT_PROPS = { emissiveIntensity: 1, opacity: 1 };

const PrimaryLight = ({ lastEvent, secondsSinceSongStart }) => {
  // TODO: laser beams for along the side and maybe along the bottom too?
  const status = lastEvent ? lastEvent.type : 'off';
  const lastEventId = lastEvent ? lastEvent.id : null;

  const color =
    status === 'off' ? LASER_COLORS.off : LASER_COLORS[lastEvent.color];
  const brightColor =
    status === 'off'
      ? LASER_COLORS.off
      : LASER_COLORS[lastEvent.color + '-bright'];

  const springConfig = getSpringConfigForLight(
    [ON_PROPS, OFF_PROPS, BRIGHT_PROPS],
    status
  );

  useOnChange(() => {
    const statusShouldReset = status === 'flash' || status === 'fade';

    springConfig.reset = statusShouldReset;
  }, lastEventId);

  const spring = useSpring(springConfig);

  const z = -85;

  const hatSideLength = 5;
  const hatThickness = 0.5;

  return (
    <>
      <group position={[0, 0, z]} rotation={[0, 0, -Math.PI * 0.25]}>
        <mesh position={[0, hatSideLength / 2 + hatThickness / 2, 0]}>
          <boxGeometry
            attach="geometry"
            args={[hatSideLength, hatThickness, hatThickness]}
          />
          <animated.meshLambertMaterial
            attach="material"
            emissive={color}
            transparent
            {...spring}
          />
        </mesh>
        <mesh
          position={[
            -hatSideLength / 2 + hatThickness / 2,
            hatThickness / 2,
            0,
          ]}
          rotation={[0, 0, Math.PI * 0.5]}
        >
          <boxGeometry
            attach="geometry"
            args={[hatSideLength - hatThickness, hatThickness, hatThickness]}
          />
          <animated.meshLambertMaterial
            attach="material"
            emissive={color}
            transparent
            {...spring}
          />
        </mesh>
      </group>

      <Glow
        color={color}
        x={0}
        y={0}
        z={z}
        size={30}
        status={status}
        lastEventId={lastEvent ? lastEvent.id : null}
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const trackId = 'primaryLight';

  const currentBeat = getCursorPositionInBeats(state);

  const lastEvent = getEventForTrackAtBeat(state, trackId, currentBeat);

  const secondsSinceSongStart = getCursorPosition(state) / 1000;

  return {
    lastEvent,
    secondsSinceSongStart,
  };
};

export default connect(mapStateToProps)(PrimaryLight);
