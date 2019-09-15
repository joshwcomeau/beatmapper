import React from 'react';
import { connect } from 'react-redux';

import { LASER_COLORS } from '../../constants';
import { range, normalize, convertDegreesToRadians } from '../../utils';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getCursorPosition } from '../../reducers/navigation.reducer';
import { getEventForTrackAtBeat } from '../../reducers/editor-entities.reducer/events-view.reducer';

import LaserBeam from './LaserBeam';

const BackLaser = ({ lastEvent, secondsSinceSongStart }) => {
  const NUM_OF_BEAMS_PER_SIDE = 5;
  const laserIndices = range(0, NUM_OF_BEAMS_PER_SIDE);

  const zDistanceBetweenBeams = -25;

  const status = lastEvent ? lastEvent.type : 'off';
  const eventId = lastEvent ? lastEvent.id : null;
  const color =
    status === 'off' ? LASER_COLORS.off : LASER_COLORS[lastEvent.color];

  const sides = ['left', 'right'];

  return sides.map(side => {
    const xOffset = 0;
    const yOffset = 10;
    const zOffset = -140;

    return laserIndices.map(index => {
      const position = [xOffset, -40, zOffset + index * zDistanceBetweenBeams];

      const rotation = [0, 0, side === 'right' ? -0.45 : 0.45];

      return (
        <LaserBeam
          key={`${side}-${index}`}
          color={color}
          position={position}
          rotation={rotation}
          lastEventId={eventId}
          status={status}
        />
      );
    });
  });
};

const mapStateToProps = (state, ownProps) => {
  const trackId = 'laserBack';

  const currentBeat = getCursorPositionInBeats(state);

  const lastEvent = getEventForTrackAtBeat(state, trackId, currentBeat);

  const secondsSinceSongStart = getCursorPosition(state) / 1000;

  return {
    lastEvent,
    secondsSinceSongStart,
  };
};

export default connect(mapStateToProps)(BackLaser);
