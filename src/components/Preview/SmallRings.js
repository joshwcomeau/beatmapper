import React from 'react';
import { connect } from 'react-redux';

import { range } from '../../utils';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getEventForTrackAtBeat } from '../../reducers/editor-entities.reducer/events-view.reducer';
import useOnChange from '../../hooks/use-on-change.hook';

import Ring from './Ring';

const INITIAL_ROTATION = Math.PI * 0.25;
const DISTANCE_BETWEEN_RINGS_MIN = 3;
const DISTANCE_BETWEEN_RINGS_MAX = 10;

const SmallRings = ({ numOfRings = 16, lastEvent }) => {
  const lastEventId = lastEvent ? lastEvent.id : null;
  const firstRingOffset = -8;

  const [distanceBetweenRings, setDistanceBetweenRings] = React.useState(
    DISTANCE_BETWEEN_RINGS_MIN
  );

  useOnChange(() => {
    setDistanceBetweenRings(
      distanceBetweenRings === DISTANCE_BETWEEN_RINGS_MAX
        ? DISTANCE_BETWEEN_RINGS_MIN
        : DISTANCE_BETWEEN_RINGS_MAX
    );
  }, lastEventId);

  return range(numOfRings).map(index => (
    <Ring
      key={index}
      size={12}
      y={-2}
      z={firstRingOffset + distanceBetweenRings * index * -1}
      rotation={INITIAL_ROTATION + index * 0.1}
    />
  ));
};

const mapStateToProps = state => {
  const trackId = 'smallRing';

  const currentBeat = getCursorPositionInBeats(state);

  return {
    lastEvent: getEventForTrackAtBeat(state, trackId, currentBeat),
  };
};

export default connect(mapStateToProps)(SmallRings);
