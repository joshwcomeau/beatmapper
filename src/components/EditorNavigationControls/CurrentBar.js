import React from 'react';
import { connect } from 'react-redux';

import { getFormattedBarsAndBeats } from '../../helpers/audio.helpers';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import LabeledNumber from '../LabeledNumber';
import { roundToNearest } from '../../utils';

const CurrentBar = ({ displayString }) => {
  return <LabeledNumber label="Bars">{displayString}</LabeledNumber>;
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);

  let displayString = '--';
  if (song) {
    const cursorPositionInBeats = getCursorPositionInBeats(state);

    // When the song is playing, this number will move incredibly quickly.
    // It's a hot blurry mess.
    // Instead of trying to debounce rendering, let's just round the value
    // aggressively
    displayString = getFormattedBarsAndBeats(
      roundToNearest(cursorPositionInBeats, 0.5)
    );
  }

  return {
    displayString,
  };
};

export default connect(mapStateToProps)(CurrentBar);
