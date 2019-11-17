import React from 'react';
import { connect } from 'react-redux';

import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import { getProcessingDelay } from '../../reducers/user.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';
import useOnChange from '../../hooks/use-on-change.hook';
import { range } from '../../utils';

import { findMostRecentEventInTrack } from './Preview.helpers';
import BracketRing from './BracketRing';

const INITIAL_ROTATION = Math.PI * 0.25;
const DISTANCE_BETWEEN_RINGS_MIN = 3;
const DISTANCE_BETWEEN_RINGS_MAX = 10;

const SmallRings = ({ numOfRings = 16, lastZoomEvent, lastRotationEvent }) => {
  const lastZoomEventId = lastZoomEvent ? lastZoomEvent.id : null;
  const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;
  const firstRingOffset = -8;

  const [distanceBetweenRings, setDistanceBetweenRings] = React.useState(
    DISTANCE_BETWEEN_RINGS_MIN
  );

  const [rotationRatio, setRotationRatio] = React.useState(0.1);

  useOnChange(() => {
    if (lastZoomEventId) {
      setDistanceBetweenRings(
        distanceBetweenRings === DISTANCE_BETWEEN_RINGS_MAX
          ? DISTANCE_BETWEEN_RINGS_MIN
          : DISTANCE_BETWEEN_RINGS_MAX
      );
    }
  }, lastZoomEventId);

  useOnChange(() => {
    if (lastRotationEventId) {
      setRotationRatio(rotationRatio + 0.25);
    }
  }, lastRotationEventId);

  return range(numOfRings).map(index => (
    <BracketRing
      key={index}
      size={12}
      thickness={0.4}
      y={-2}
      z={firstRingOffset + distanceBetweenRings * index * -1}
      rotation={INITIAL_ROTATION + index * rotationRatio}
      color="#333"
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
  const processingDelay = getProcessingDelay(state);

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

  return {
    lastZoomEvent,
    lastRotationEvent,
  };
};

export default connect(mapStateToProps)(SmallRings);
