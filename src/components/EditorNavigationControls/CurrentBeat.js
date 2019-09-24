import React from 'react';
import { connect } from 'react-redux';

import { getFormattedBeatNum } from '../../helpers/audio.helpers';
import {
  getCursorPositionInBeats,
  getIsPlaying,
} from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import LabeledNumber from '../LabeledNumber';
import { roundToNearest } from '../../utils';

const CurrentBeat = ({ displayString }) => {
  return <LabeledNumber label="Beat">{displayString}</LabeledNumber>;
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);
  const isPlaying = getIsPlaying(state);

  let displayString = '--';
  if (song) {
    const cursorPositionInBeats = getCursorPositionInBeats(state);

    // When the song is playing, this number will move incredibly quickly.
    // It's a hot blurry mess.
    // Instead of trying to debounce rendering, let's just round the value
    // aggressively
    let roundedCursorPosition = isPlaying
      ? roundToNearest(cursorPositionInBeats, 0.5)
      : cursorPositionInBeats;

    displayString = getFormattedBeatNum(roundedCursorPosition);
  }

  return {
    displayString,
  };
};

export default connect(mapStateToProps)(CurrentBeat);
