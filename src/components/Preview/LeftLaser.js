import React from 'react';
import { connect } from 'react-redux';

import { range, convertDegreesToRadians } from '../../utils';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getEventForTrackAtBeat } from '../../reducers/editor-entities.reducer/events-view.reducer';

import LaserBeam from './LaserBeam';

const LeftLaser = ({ side = 'left', lastEvent }) => {
  // Our LeftLaser actually consists of 4 individual beams.
  // They're parallel when not moving
  const laserIndices = range(0, 4);

  const startOffset = -100;
  const zDistanceBetweenBeams = 10;
  const xDistanceBetweenBeams = side === 'left' ? 2 : -2;

  const status = lastEvent ? lastEvent.type : 'off';
  const eventId = lastEvent ? lastEvent.id : null;
  const color = status === 'off' ? '#000000' : lastEvent.color;

  return laserIndices.map(index => {
    const position = [
      index * xDistanceBetweenBeams,
      0,
      startOffset + index * zDistanceBetweenBeams,
    ];

    const rotation = [
      0,
      0,
      convertDegreesToRadians(side === 'left' ? 45 : -45),
    ];

    return (
      <LaserBeam
        key={index}
        color={color}
        position={position}
        rotation={rotation}
        lastEventId={eventId}
        status={status}
      />
    );
  });
};

const mapStateToProps = state => {
  const trackId = 'laserLeft';
  const currentBeat = getCursorPositionInBeats(state);

  return {
    lastEvent: getEventForTrackAtBeat(state, trackId, currentBeat),
  };
};

export default connect(mapStateToProps)(LeftLaser);
