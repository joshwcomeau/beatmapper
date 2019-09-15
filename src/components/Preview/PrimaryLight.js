import React from 'react';
import { connect } from 'react-redux';

import { LASER_COLORS } from '../../constants';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getCursorPosition } from '../../reducers/navigation.reducer';
import { getEventForTrackAtBeat } from '../../reducers/editor-entities.reducer/events-view.reducer';

import LaserBeam from './LaserBeam';
import Glow from './Glow';

const PrimaryLight = ({ lastEvent, secondsSinceSongStart }) => {
  // TODO: laser beams for along the side and maybe along the bottom too?
  const status = lastEvent ? lastEvent.type : 'off';

  const color =
    status === 'off' ? LASER_COLORS.off : LASER_COLORS[lastEvent.color];

  return (
    <>
      <Glow
        color={color}
        x={0}
        y={0}
        z={-85}
        size={30}
        status={status}
        lastEventId={lastEvent ? lastEvent.id : null}
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const trackId = 'primaryLight';

  const currentBeat = getCursorPositionInBeats(state);

  const lastEvent = getEventForTrackAtBeat(state, trackId, currentBeat);

  const secondsSinceSongStart = getCursorPosition(state) / 1000;

  return {
    lastEvent,
    secondsSinceSongStart,
  };
};

export default connect(mapStateToProps)(PrimaryLight);
