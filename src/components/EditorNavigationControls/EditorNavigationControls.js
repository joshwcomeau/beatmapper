import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { skipBack } from 'react-icons-kit/feather/skipBack';
import { rewind } from 'react-icons-kit/feather/rewind';
import { play } from 'react-icons-kit/feather/play';
import { pause } from 'react-icons-kit/feather/pause';
import { fastForward } from 'react-icons-kit/feather/fastForward';
import { skipForward } from 'react-icons-kit/feather/skipForward';

import * as actions from '../../actions';
import { UNIT, COLORS, SNAPPING_INCREMENTS } from '../../constants';

import IconButton from '../IconButton';
import SpacedChildren from '../SpacedChildren';
import Dropdown from '../Dropdown';
import Spacer from '../Spacer';

import CurrentTime from './CurrentTime';
import CurrentBeat from './CurrentBeat';

const EditorNavigationControls = ({
  height,
  view,
  isPlaying,
  isLoadingSong,
  snapTo,
  startPlaying,
  pausePlaying,
  skipToStart,
  skipToEnd,
  seekForwards,
  seekBackwards,
  changeSnapping,
}) => {
  const playButtonAction = isPlaying ? pausePlaying : startPlaying;

  // TODO: Use `height`

  return (
    <Wrapper>
      <Left>
        <Dropdown
          label="Snap to"
          value={snapTo}
          onChange={ev => changeSnapping(Number(ev.target.value))}
          width={165}
        >
          {SNAPPING_INCREMENTS.map(({ value, label, shortcutLabel }) => (
            <option key={value} value={value} when-selected={label}>
              {label} {shortcutLabel && `(${shortcutLabel})`}
            </option>
          ))}
        </Dropdown>
      </Left>
      <Center>
        <SpacedChildren spacing={UNIT}>
          <IconButton
            disabled={isLoadingSong}
            color={COLORS.white}
            icon={skipBack}
            onClick={skipToStart}
          />
          <IconButton
            disabled={isLoadingSong}
            color={COLORS.white}
            icon={rewind}
            onClick={ev => {
              seekBackwards(view);
            }}
          />
          <IconButton
            disabled={isLoadingSong}
            color={COLORS.white}
            icon={isPlaying ? pause : play}
            onClick={playButtonAction}
          />
          <IconButton
            disabled={isLoadingSong}
            color={COLORS.white}
            icon={fastForward}
            onClick={ev => {
              seekForwards(view);
            }}
          />
          <IconButton
            disabled={isLoadingSong}
            color={COLORS.white}
            icon={skipForward}
            onClick={skipToEnd}
          />
        </SpacedChildren>
      </Center>
      <Right>
        <CurrentTime />
        <Spacer size={UNIT * 4} />
        <CurrentBeat />
      </Right>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const Left = styled(Column)`
  justify-content: flex-start;
`;
const Center = styled(Column)`
  justify-content: center;
`;
const Right = styled(Column)`
  justify-content: flex-end;
`;

const mapStateToProps = state => ({
  isPlaying: state.navigation.isPlaying,
  isLoadingSong: state.navigation.isLoading,
  snapTo: state.navigation.snapTo,
});

const mapDispatchToProps = {
  startPlaying: actions.startPlaying,
  pausePlaying: actions.pausePlaying,
  seekForwards: actions.seekForwards,
  seekBackwards: actions.seekBackwards,
  skipToStart: actions.skipToStart,
  skipToEnd: actions.skipToEnd,
  changeSnapping: actions.changeSnapping,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorNavigationControls);
