import React from 'react';
import { connect } from 'react-redux';

import { getColorForItem } from '../../helpers/colors.helpers';
import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getUsableProcessingDelay } from '../../reducers/user.reducer';
import { getTracks } from '../../reducers/editor-entities.reducer/events-view.reducer';
import { range } from '../../utils';

import { findMostRecentEventInTrack } from './Preview.helpers';
import LaserBeam from './LaserBeam';

const BackLaser = ({ song, isPlaying, lastEvent, secondsSinceSongStart }) => {
  const NUM_OF_BEAMS_PER_SIDE = 5;
  const laserIndices = range(0, NUM_OF_BEAMS_PER_SIDE);

  const zDistanceBetweenBeams = -25;

  const status = lastEvent ? lastEvent.type : 'off';
  const eventId = lastEvent ? lastEvent.id : null;
  const color =
    status === 'off' ? '#000000' : getColorForItem(lastEvent.colorType, song);

  const sides = ['left', 'right'];

  return sides.map(side => {
    const xOffset = 0;
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
          isPlaying={isPlaying}
        />
      );
    });
  });
};

const mapStateToProps = (state, { song }) => {
  if (!song) {
    return;
  }

  const trackId = 'laserBack';

  const tracks = getTracks(state);
  const events = tracks[trackId];

  const currentBeat = getCursorPositionInBeats(state);
  const processingDelay = getUsableProcessingDelay(state);
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

export default connect(mapStateToProps)(BackLaser);
