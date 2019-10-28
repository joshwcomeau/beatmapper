import React from 'react';
import { connect } from 'react-redux';

import { SONG_OFFSET, SURFACE_DEPTH } from '../../constants';
import { range } from '../../utils';
import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../../reducers/navigation.reducer';
import { getSelectedSong, getGridSize } from '../../reducers/songs.reducer';

import Marker from './Marker';

const BarMarkers = ({
  duration,
  bpm,
  cursorPositionInBeats,
  beatDepth,
  gridRows,
}) => {
  const numToRender = SURFACE_DEPTH / beatDepth;
  const totalNumOfBeats = Math.ceil(convertMillisecondsToBeats(duration, bpm));

  const linesArray = React.useMemo(() => range(totalNumOfBeats * 4), [
    totalNumOfBeats,
  ]);
  const visibleSubsetOfLines = linesArray.filter(i => {
    const beat = i / 4;

    // I want to truncate all lines before the cursorPosition, but if I use
    // the exact value, sometimes the line right AT the cursor gets cut off.
    // Add a tiny fudge factor to allow a bit of leniency
    const FUDGE_FACTOR = 0.1;

    return (
      beat >= cursorPositionInBeats - FUDGE_FACTOR &&
      beat < cursorPositionInBeats + numToRender + FUDGE_FACTOR
    );
  });

  return visibleSubsetOfLines.map(i => {
    const isBeat = i % 4 === 0;
    const type = isBeat ? 'beat' : 'sub-beat';

    return (
      <Marker
        key={i}
        beatNum={isBeat && i / 4}
        offset={-SONG_OFFSET + -i * (beatDepth / 4)}
        type={type}
        gridRows={gridRows}
      />
    );
  });
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);
  const gridSize = getGridSize(state);

  return {
    duration: state.navigation.duration,
    bpm: song ? song.bpm : null,
    cursorPositionInBeats: getCursorPositionInBeats(state),
    beatDepth: getBeatDepth(state),
    gridRows: gridSize.numRows,
  };
};

export default connect(mapStateToProps)(BarMarkers);
