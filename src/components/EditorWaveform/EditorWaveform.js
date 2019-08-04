import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getSelectedSong } from '../../reducers/songs.reducer';
import useBoundingBox from '../../hooks/use-bounding-box.hook';

import ScrubbableWaveform from '../ScrubbableWaveform';
import CenteredSpinner from '../CenteredSpinner';

const EditorWaveform = ({
  height,
  song,
  waveformData,
  isLoadingSong,
  duration,
  cursorPosition,
  scrubWaveform,
}) => {
  const [ref, boundingBox] = useBoundingBox();

  return (
    <div ref={ref}>
      {isLoadingSong && (
        <SpinnerWrapper>
          <CenteredSpinner />
        </SpinnerWrapper>
      )}
      {boundingBox && song && (
        <ScrubbableWaveform
          key={song.id + '-' + song.selectedDifficulty}
          width={boundingBox.width}
          height={height - UNIT * 2}
          waveformData={waveformData}
          duration={duration}
          cursorPosition={cursorPosition}
          scrubWaveform={scrubWaveform}
        />
      )}
    </div>
  );
};

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
    waveformData: state.waveform.data,
    isLoadingSong: state.navigation.isLoading,
    duration: state.navigation.duration,
    cursorPosition: state.navigation.cursorPosition,
  };
};

const mapDispatchToProps = { scrubWaveform: actions.scrubWaveform };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorWaveform);
