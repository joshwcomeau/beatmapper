import React from 'react';
import { connect } from 'react-redux';

import { getFormattedBarsAndBeats } from '../../helpers/audio.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import LabeledNumber from '../LabeledNumber';
import { roundToNearest } from '../../utils';

const CurrentBar = ({ isPlaying, cursorPositionInBeats }) => {
  // When the song is playing, this number will move incredibly quickly.
  // It's a hot blurry mess.
  // Instead of trying to debounce rendering, let's just round the value
  // aggressively
  const roundedCursorPositionInBeats = isPlaying
    ? roundToNearest(cursorPositionInBeats, 0.5)
    : cursorPositionInBeats;

  return (
    <LabeledNumber label="Bars">
      {getFormattedBarsAndBeats(roundedCursorPositionInBeats)}
    </LabeledNumber>
  );
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);

  return {
    isPlaying: state.navigation.isPlaying,
    cursorPositionInBeats: song ? getCursorPositionInBeats(state) : '--',
  };
};

export default connect(mapStateToProps)(CurrentBar);
