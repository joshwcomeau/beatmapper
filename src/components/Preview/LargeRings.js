import React from 'react';
import { connect } from 'react-redux';
import { useTrail } from 'react-spring/three';

import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getColorForItem } from '../../helpers/colors.helpers';
import {
  getCursorPositionInBeats,
  getAnimateRingMotion,
} from '../../reducers/navigation.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import {
  getUsableProcessingDelay,
  getGraphicsLevel,
} from '../../reducers/user.reducer';
import useOnChange from '../../hooks/use-on-change.hook';

import { findMostRecentEventInTrack } from './Preview.helpers';
import LitSquareRing from './LitSquareRing';

const INITIAL_ROTATION = Math.PI * 0.25;
const INCREMENT_ROTATION_BY = Math.PI * 0.5;
const DISTANCE_BETWEEN_RINGS = 18;

const LargeRings = ({
  song,
  isPlaying,
  numOfRings,
  animateRingMotion,
  lastRotationEvent,
  lastLightingEvent,
}) => {
  const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;

  const firstRingOffset = -60;

  const [rotationRatio, setRotationRatio] = React.useState(0);

  const lightStatus = lastLightingEvent ? lastLightingEvent.type : 'off';
  const lastLightingEventId = lastLightingEvent ? lastLightingEvent.id : null;
  const lightColor =
    lightStatus === 'off'
      ? '#000000'
      : getColorForItem(lastLightingEvent.colorType, song);

  // TODO: Custom hook that is shared with SmallRings
  useOnChange(() => {
    if (!isPlaying || !lastRotationEventId) {
      return;
    }

    const shouldChangeDirection = Math.random() < 0.25;
    const directionMultiple = shouldChangeDirection ? 1 : -1;

    setRotationRatio(rotationRatio + INCREMENT_ROTATION_BY * directionMultiple);
  }, lastRotationEventId);

  const trail = useTrail(numOfRings, {
    to: {
      rotation: [0, 0, INITIAL_ROTATION * rotationRatio],
    },
    immediate: !animateRingMotion,
    config: {
      tension: 2500,
      friction: 600,
      mass: 1,
      precision: 0.001,
    },
  });

  return trail.map((trailProps, index) => (
    <LitSquareRing
      key={index}
      index={index}
      size={128}
      thickness={2.5}
      y={-2}
      z={firstRingOffset + DISTANCE_BETWEEN_RINGS * index * -1}
      color="#111111"
      rotation={trailProps.rotation}
      lightStatus={lightStatus}
      lightColor={lightColor}
      lastLightingEventId={lastLightingEventId}
      isPlaying={isPlaying}
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
  const processingDelay = getUsableProcessingDelay(state);

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

  const animateRingMotion = getAnimateRingMotion(state);

  return {
    lastRotationEvent,
    lastLightingEvent,
    numOfRings,
    animateRingMotion,
  };
};

export default connect(mapStateToProps)(LargeRings);
