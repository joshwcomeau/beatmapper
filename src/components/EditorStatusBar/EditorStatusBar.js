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
import { minimize2 as distanceCloseIcon } from 'react-icons-kit/feather/minimize2';
import { maximize2 as distanceFarIcon } from 'react-icons-kit/feather/maximize2';
import { layers as densityIcon } from 'react-icons-kit/feather/layers';

import * as actions from '../../actions';
import { COLORS, UNIT } from '../../constants';
import { roundTo } from '../../utils';
import {
  getNumOfBlocks,
  getNumOfMines,
  getNumOfObstacles,
  getNoteDensity,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getIsLoading,
  getPlaybackRate,
  getBeatDepth,
  getVolume,
  getPlayNoteTick,
} from '../../reducers/navigation.reducer';

import Spacer from '../Spacer';

import CountIndicator from './CountIndicator';
import SliderGroup from './SliderGroup';
import Toggle from './Toggle';

const pluralize = (num, string) => {
  const noun = num === 1 ? string : `${string}s`;

  return `${num} ${noun}`;
};

const EditorStatusBar = ({
  height,
  isLoading,
  numOfBlocks,
  numOfMines,
  numOfObstacles,
  playbackRate,
  beatDepth,
  volume,
  noteDensity,
  playNoteTick,
  updatePlaybackSpeed,
  updateBeatDepth,
  updateVolume,
  toggleNoteTick,
}) => {
  return (
    <Wrapper style={{ height, lineHeight: `${height}px` }}>
      <Left>
        <CountIndicator
          num={numOfBlocks}
          label={pluralize(numOfBlocks, 'block')}
          icon={box}
        />
        <Spacer size={UNIT * 2} />
        <CountIndicator
          num={numOfMines}
          label={pluralize(numOfBlocks, 'mine')}
          icon={globe}
        />
        <Spacer size={UNIT * 2} />
        <CountIndicator
          num={numOfObstacles}
          label={pluralize(numOfBlocks, 'obstacle')}
          icon={codepen}
        />
        <Spacer size={UNIT * 6} />
        <CountIndicator
          num={roundTo(noteDensity, 1)}
          label="Notes per second"
          icon={densityIcon}
        />
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
          disabled={isLoading}
          width={UNIT * 7}
          height={height}
          minIcon={distanceCloseIcon}
          maxIcon={distanceFarIcon}
          min={1}
          max={16}
          value={beatDepth}
          onChange={value => updateBeatDepth(value)}
        />
        <Spacer size={UNIT * 6} />
        <SliderGroup
          includeMidpointTick
          disabled={isLoading}
          width={UNIT * 7}
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
          width={UNIT * 7}
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
    beatDepth: getBeatDepth(state),
    volume: getVolume(state),
    playNoteTick: getPlayNoteTick(state),
    numOfBlocks: getNumOfBlocks(state),
    numOfMines: getNumOfMines(state),
    numOfObstacles: getNumOfObstacles(state),
    noteDensity: getNoteDensity(state),
  };
};

const mapDispatchToProps = {
  updatePlaybackSpeed: actions.updatePlaybackSpeed,
  updateBeatDepth: actions.updateBeatDepth,
  updateVolume: actions.updateVolume,
  toggleNoteTick: actions.toggleNoteTick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorStatusBar);
