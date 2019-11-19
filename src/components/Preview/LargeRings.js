import React from 'react';
import { connect } from 'react-redux';
import { useTrail } from 'react-spring/three';

import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getColorForItem } from '../../helpers/colors.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import {
  getProcessingDelay,
  getGraphicsLevel,
} from '../../reducers/user.reducer';
import useOnChange from '../../hooks/use-on-change.hook';

import { findMostRecentEventInTrack } from './Preview.helpers';
import LitSquareRing from './LitSquareRing';

const INITIAL_ROTATION = Math.PI * 0.25;
const DISTANCE_BETWEEN_RINGS = 18;

const LargeRings = ({
  song,
  isPlaying,
  numOfRings,
  lastRotationEvent,
  lastLightingEvent,
}) => {
  const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;

  const firstRingOffset = -26;

  const [rotationRatio, setRotationRatio] = React.useState(0);

  const lightStatus = lastLightingEvent ? lastLightingEvent.type : 'off';
  const lastLightingEventId = lastLightingEvent ? lastLightingEvent.id : null;
  const lightColor =
    lightStatus === 'off'
      ? '#000000'
      : getColorForItem(lastLightingEvent.colorType, song);

  useOnChange(() => {
    if (!isPlaying) {
      return;
    }

    const shouldChangeDirection = Math.random() < 0.25;
    const directionMultiple = shouldChangeDirection ? 1 : -1;

    setRotationRatio(rotationRatio + Math.PI * 0.25 * directionMultiple);
  }, lastRotationEventId);

  // () => ({ xy: [0, 0], config: i => (i === 0 ? fast : slow) });

  const trail = useTrail(numOfRings, {
    to: {
      rotationRatio,
    },
    config: {
      tension: 2500,
      friction: 800,
      mass: 1,
      precision: 0.001,
    },
  });

  return trail.map((trailProps, index) => (
    <LitSquareRing
      key={index}
      index={index}
      size={96}
      thickness={2.5}
      y={-2}
      z={firstRingOffset + DISTANCE_BETWEEN_RINGS * index * -1}
      color="#111111"
      lightStatus={lightStatus}
      lightColor={lightColor}
      lastLightingEventId={lastLightingEventId}
      isPlaying={isPlaying}
      getRotation={() => {
        return trailProps.rotationRatio.interpolate(ratio => [
          0,
          0,
          INITIAL_ROTATION + (index + 1) * ratio,
        ]);
      }}
    />
  ));
};

const mapStateToProps = (state, { song }) => {
  if (!song) {
    return;
  }

  const tracks = getTracks(state);

  const rotationTrackId = 'largeRing';
  const lightingTrackId = 'trackNeons';

  const rotationEvents = tracks[rotationTrackId];
  const lightingEvents = tracks[lightingTrackId];

  const currentBeat = getCursorPositionInBeats(state);
  const processingDelay = getProcessingDelay(state);

  const processingDelayInBeats = convertMillisecondsToBeats(
    processingDelay,
    song.bpm
  );

  const lastRotationEvent = findMostRecentEventInTrack(
    rotationEvents,
    currentBeat,
    processingDelayInBeats
  );
  const lastLightingEvent = findMostRecentEventInTrack(
    lightingEvents,
    currentBeat,
    processingDelayInBeats
  );

  const graphicsLevel = getGraphicsLevel(state);

  let numOfRings;
  switch (graphicsLevel) {
    case 'high': {
      numOfRings = 16;
      break;
    }
    default:
    case 'medium': {
      numOfRings = 8;
      break;
    }
    case 'low': {
      numOfRings = 4;
      break;
    }
  }

  return {
    lastRotationEvent,
    lastLightingEvent,
    numOfRings,
  };
};

export default connect(mapStateToProps)(LargeRings);
