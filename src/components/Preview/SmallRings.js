import React from 'react';
import { connect } from 'react-redux';

import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
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
import { range } from '../../utils';

import { findMostRecentEventInTrack } from './Preview.helpers';
import BracketRing from './BracketRing';

const INITIAL_ROTATION = Math.PI * 0.25;
const INCREMENT_ROTATION_BY = Math.PI * 0.5;
const DISTANCE_BETWEEN_RINGS_MIN = 3;
const DISTANCE_BETWEEN_RINGS_MAX = 10;

const SmallRings = ({
  numOfRings,
  animateRingMotion,
  isPlaying,
  lastZoomEvent,
  lastRotationEvent,
}) => {
  const lastZoomEventId = lastZoomEvent ? lastZoomEvent.id : null;
  const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;
  const firstRingOffset = -8;

  const [distanceBetweenRings, setDistanceBetweenRings] = React.useState(
    DISTANCE_BETWEEN_RINGS_MIN
  );

  const [rotationRatio, setRotationRatio] = React.useState(0.1);

  useOnChange(() => {
    if (!isPlaying) {
      return;
    }

    if (lastZoomEventId) {
      setDistanceBetweenRings(
        distanceBetweenRings === DISTANCE_BETWEEN_RINGS_MAX
          ? DISTANCE_BETWEEN_RINGS_MIN
          : DISTANCE_BETWEEN_RINGS_MAX
      );
    }
  }, lastZoomEventId);

  // TODO: Custom hook that is shared with LArgeRings
  useOnChange(() => {
    if (!isPlaying || !lastRotationEventId) {
      return;
    }

    const shouldChangeDirection = Math.random() < 0.5;
    const directionMultiple = shouldChangeDirection ? 1 : -1;

    setRotationRatio(rotationRatio + INCREMENT_ROTATION_BY * directionMultiple);
  }, lastRotationEventId);

  return range(numOfRings).map(index => (
    <BracketRing
      key={index}
      size={16}
      thickness={0.4}
      y={-2}
      z={firstRingOffset + distanceBetweenRings * index * -1}
      rotation={INITIAL_ROTATION + index * rotationRatio}
      color="#1C1C1C"
    />
  ));
};

const mapStateToProps = (state, { song }) => {
  if (!song) {
    return;
  }

  const tracks = getTracks(state);

  const zoomTrackId = 'smallRing';
  const rotationTrackId = 'largeRing';

  const zoomEvents = tracks[zoomTrackId];
  const rotationEvents = tracks[rotationTrackId];

  const currentBeat = getCursorPositionInBeats(state);
  const processingDelay = getUsableProcessingDelay(state);

  const processingDelayInBeats = convertMillisecondsToBeats(
    processingDelay,
    song.bpm
  );

  const lastZoomEvent = findMostRecentEventInTrack(
    zoomEvents,
    currentBeat,
    processingDelayInBeats
  );
  const lastRotationEvent = findMostRecentEventInTrack(
    rotationEvents,
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
      numOfRings = 12;
      break;
    }
    case 'low': {
      numOfRings = 8;
      break;
    }
  }

  const animateRingMotion = getAnimateRingMotion(state);

  return {
    lastZoomEvent,
    lastRotationEvent,
    numOfRings,
    animateRingMotion,
  };
};

export default connect(mapStateToProps)(SmallRings);
