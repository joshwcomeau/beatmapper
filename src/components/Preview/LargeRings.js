import React from 'react';
import { connect } from 'react-redux';

import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getColorForItem } from '../../helpers/colors.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import { getProcessingDelay } from '../../reducers/user.reducer';
import useOnChange from '../../hooks/use-on-change.hook';
import { range } from '../../utils';

import { findMostRecentEventInTrack } from './Preview.helpers';
import LitSquareRing from './LitSquareRing';

const INITIAL_ROTATION = Math.PI * 0.25;
const DISTANCE_BETWEEN_RINGS = 18;

const LargeRings = ({
  song,
  numOfRings = 16,
  lastRotationEvent,
  lastLightingEvent,
}) => {
  const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;

  const firstRingOffset = -8;

  const [rotationRatio, setRotationRatio] = React.useState(0);

  const lightStatus = lastLightingEvent ? lastLightingEvent.type : 'off';
  const lastLightingEventId = lastLightingEvent ? lastLightingEvent.id : null;
  const lightColor =
    lightStatus === 'off'
      ? '#000000'
      : getColorForItem(lastLightingEvent.colorType, song);

  useOnChange(() => {
    setRotationRatio(rotationRatio + 0.45);
  }, lastRotationEventId);

  return range(numOfRings).map(index => (
    <LitSquareRing
      key={index}
      size={96}
      thickness={2.5}
      y={-2}
      z={firstRingOffset + DISTANCE_BETWEEN_RINGS * index * -1}
      rotation={INITIAL_ROTATION + index * rotationRatio}
      color="#111111"
      lightStatus={lightStatus}
      lightColor={lightColor}
      lastLightingEventId={lastLightingEventId}
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

  return {
    lastRotationEvent,
    lastLightingEvent,
  };
};

export default connect(mapStateToProps)(LargeRings);
