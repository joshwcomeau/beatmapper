/**
 * TODO: This status bar is reused across two views, but the views don't
 * need the same info :/ I should create a shared "root" component with slots
 * for the stuff that is variant.
 */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { box } from 'react-icons-kit/feather/box';
import { codepen } from 'react-icons-kit/feather/codepen';
import { globe } from 'react-icons-kit/feather/globe';
import { volumeX as volumeMinIcon } from 'react-icons-kit/feather/volumeX';
import { volume2 as volumeMaxIcon } from 'react-icons-kit/feather/volume2';
import { fastForward as playbackSpeedMaxIcon } from 'react-icons-kit/feather/fastForward';
import { music as playbackSpeedMinIcon } from 'react-icons-kit/feather/music';
import { bell as tickOnIcon } from 'react-icons-kit/feather/bell';
import { bellOff as tickOffIcon } from 'react-icons-kit/feather/bellOff';

import * as actions from '../../actions';
import { COLORS, UNIT } from '../../constants';
import {
  getNumOfBlocks,
  getNumOfMines,
  getNumOfObstacles,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getIsLoading,
  getPlaybackRate,
  getVolume,
  getPlayNoteTick,
} from '../../reducers/navigation.reducer';

import Spacer from '../Spacer';

import CountIndicator from './CountIndicator';
import SliderGroup from './SliderGroup';
import Toggle from './Toggle';

const EditorStatusBar = ({
  height,
  isLoading,
  numOfBlocks,
  numOfMines,
  numOfObstacles,
  playbackRate,
  volume,
  playNoteTick,
  updatePlaybackSpeed,
  updateVolume,
  toggleNoteTick,
}) => {
  return (
    <Wrapper style={{ height, lineHeight: `${height}px` }}>
      <Left>
        <CountIndicator num={numOfBlocks} type="block" icon={box} />
        <Spacer size={UNIT * 2} />
        <CountIndicator num={numOfMines} type="mine" icon={globe} />
        <Spacer size={UNIT * 2} />
        <CountIndicator num={numOfObstacles} type="obstacle" icon={codepen} />
      </Left>
      <Right>
        <Toggle
          size={8}
          value={playNoteTick}
          onIcon={tickOnIcon}
          offIcon={tickOffIcon}
          onChange={toggleNoteTick}
        />
        <Spacer size={UNIT * 6} />
        <SliderGroup
          includeMidpointTick
          disabled={isLoading}
          width={UNIT * 10}
          height={height}
          minIcon={playbackSpeedMinIcon}
          maxIcon={playbackSpeedMaxIcon}
          min={0.5}
          max={1.5}
          step={0.1}
          value={playbackRate}
          onChange={value => updatePlaybackSpeed(value)}
        />
        <Spacer size={UNIT * 6} />
        <SliderGroup
          width={UNIT * 10}
          height={height}
          minIcon={volumeMinIcon}
          maxIcon={volumeMaxIcon}
          min={0}
          max={1}
          value={volume}
          onChange={value => updateVolume(value)}
        />
      </Right>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${COLORS.blueGray[900]};
  font-size: 12px;
  padding: 0 ${UNIT * 2}px;
  color: ${COLORS.blueGray[300]};
`;

const Left = styled.div`
  display: flex;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const mapStateToProps = state => {
  return {
    isLoading: getIsLoading(state),
    playbackRate: getPlaybackRate(state),
    volume: getVolume(state),
    playNoteTick: getPlayNoteTick(state),
    numOfBlocks: getNumOfBlocks(state),
    numOfMines: getNumOfMines(state),
    numOfObstacles: getNumOfObstacles(state),
  };
};

const mapDispatchToProps = {
  updatePlaybackSpeed: actions.updatePlaybackSpeed,
  updateVolume: actions.updateVolume,
  toggleNoteTick: actions.toggleNoteTick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorStatusBar);
