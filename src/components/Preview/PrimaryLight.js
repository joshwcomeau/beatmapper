import React from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring/three';

import { getColorForItem } from '../../helpers/colors.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';

import { getProcessingDelay } from '../../reducers/user.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import useOnChange from '../../hooks/use-on-change.hook';

import {
  findMostRecentEventInTrack,
  getSpringConfigForLight,
} from './Preview.helpers';

import Glow from './Glow';

const ON_PROPS = { emissiveIntensity: 0.75, opacity: 0.75 };
const OFF_PROPS = { emissiveIntensity: 0, opacity: 0 };
const BRIGHT_PROPS = { emissiveIntensity: 1, opacity: 1 };

const PrimaryLight = ({ song, isPlaying, lastEvent }) => {
  // TODO: laser beams for along the side and maybe along the bottom too?
  const status = lastEvent ? lastEvent.type : 'off';
  const lastEventId = lastEvent ? lastEvent.id : null;

  const color =
    status === 'off' ? '#000000' : getColorForItem(lastEvent.colorType, song);

  const springConfig = getSpringConfigForLight(
    [ON_PROPS, OFF_PROPS, BRIGHT_PROPS],
    status,
    isPlaying
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
        isPlaying={isPlaying}
      />
    </>
  );
};

const mapStateToProps = (state, { song }) => {
  if (!song) {
    return;
  }
  const trackId = 'primaryLight';

  const tracks = getTracks(state);
  const events = tracks[trackId];

  const currentBeat = getCursorPositionInBeats(state);
  const processingDelay = getProcessingDelay(state);
  const processingDelayInBeats = convertMillisecondsToBeats(
    processingDelay,
    song.bpm
  );

  const lastEvent = findMostRecentEventInTrack(
    events,
    currentBeat,
    processingDelayInBeats
  );

  return {
    lastEvent,
  };
};

export default connect(mapStateToProps)(PrimaryLight);
