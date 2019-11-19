/**
 * TODO: This status bar is reused across two views, but the views don't
 * need the same info :/ I should create a shared "root" component with slots
 * for the stuff that is variant.
 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import { zap as showLightsIcon } from 'react-icons-kit/feather/zap';
import { zapOff as hideLightsIcon } from 'react-icons-kit/feather/zapOff';
import { eyeOff as backgroundOpacityMinIcon } from 'react-icons-kit/feather/eyeOff';
import { eye as backgroundOpacityMaxIcon } from 'react-icons-kit/feather/eye';
import { alignJustify as rowHeightMinIcon } from 'react-icons-kit/feather/alignJustify';
import { menu as rowHeightMaxIcon } from 'react-icons-kit/feather/menu';

import * as actions from '../../actions';
import {
  COLORS,
  UNIT,
  NOTES_VIEW,
  EVENTS_VIEW,
  PREVIEW_VIEW,
} from '../../constants';
import {
  getNumOfBlocks,
  getNumOfMines,
  getNumOfObstacles,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getIsLoading,
  getPlaybackRate,
  getBeatDepth,
  getVolume,
  getPlayNoteTick,
} from '../../reducers/navigation.reducer';
import {
  getShowLightingPreview,
  getRowHeight,
  getBackgroundOpacity,
} from '../../reducers/editor.reducer';
import { pluralize } from '../../utils';

import Spacer from '../Spacer';

import CountIndicator from './CountIndicator';
import SliderGroup from './SliderGroup';
import Toggle from './Toggle';
import NoteDensityIndicator from './NoteDensityIndicator';

const getViewFromLocation = location => {
  if (location.pathname.match(/\/notes$/)) {
    return NOTES_VIEW;
  } else if (location.pathname.match(/\/events$/)) {
    return EVENTS_VIEW;
  } else {
    return PREVIEW_VIEW;
  }
};

const EditorStatusBar = ({
  height,
  isLoading,
  numOfBlocks,
  numOfMines,
  numOfObstacles,
  showLightingPreview,
  rowHeight,
  backgroundOpacity,
  playbackRate,
  beatDepth,
  volume,
  noteDensity,
  playNoteTick,
  updatePlaybackSpeed,
  updateBeatDepth,
  updateVolume,
  toggleNoteTick,
  togglePreviewLightingInEventsView,
  tweakEventRowHeight,
  tweakEventBackgroundOpacity,
  location,
}) => {
  const view = getViewFromLocation(location);

  let leftContent;
  let rightContent;

  if (view === NOTES_VIEW) {
    leftContent = (
      <>
        <CountIndicator
          num={numOfBlocks}
          label={pluralize(numOfBlocks, 'block')}
          icon={box}
        />
        <Spacer size={UNIT * 2} />
        <CountIndicator
          num={numOfMines}
          label={pluralize(numOfMines, 'mine')}
          icon={globe}
        />
        <Spacer size={UNIT * 2} />
        <CountIndicator
          num={numOfObstacles}
          label={pluralize(numOfObstacles, 'obstacle')}
          icon={codepen}
        />
        <Spacer size={UNIT * 6} />
        <NoteDensityIndicator />
      </>
    );

    rightContent = (
      <>
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
          min={7}
          max={14}
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
      </>
    );
  } else if (view === EVENTS_VIEW) {
    leftContent = (
      <>
        <Toggle
          size={8}
          value={showLightingPreview}
          onIcon={showLightsIcon}
          offIcon={hideLightsIcon}
          onChange={togglePreviewLightingInEventsView}
        />
        <Spacer size={UNIT * 6} />
        <SliderGroup
          width={UNIT * 5}
          height={height}
          minIcon={rowHeightMinIcon}
          maxIcon={rowHeightMaxIcon}
          min={25}
          max={50}
          step={1}
          value={rowHeight}
          onChange={value => tweakEventRowHeight(value)}
        />
        <Spacer size={UNIT * 6} />
        <SliderGroup
          disabled={isLoading}
          width={UNIT * 5}
          height={height}
          minIcon={backgroundOpacityMinIcon}
          maxIcon={backgroundOpacityMaxIcon}
          min={0.3}
          max={1}
          step={0.02}
          value={backgroundOpacity}
          onChange={value => tweakEventBackgroundOpacity(value)}
        />
      </>
    );
    rightContent = (
      <>
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
      </>
    );
  }

  return (
    <Wrapper style={{ height, lineHeight: `${height}px` }}>
      <Left>{leftContent}</Left>
      <Right>{rightContent}</Right>
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

  @media (max-width: 850px) {
    justify-content: center;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 850px) {
    display: none;
  }
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
    showLightingPreview: getShowLightingPreview(state),
    rowHeight: getRowHeight(state),
    backgroundOpacity: getBackgroundOpacity(state),
  };
};

const mapDispatchToProps = {
  updatePlaybackSpeed: actions.updatePlaybackSpeed,
  updateBeatDepth: actions.updateBeatDepth,
  updateVolume: actions.updateVolume,
  toggleNoteTick: actions.toggleNoteTick,
  togglePreviewLightingInEventsView: actions.togglePreviewLightingInEventsView,
  tweakEventRowHeight: actions.tweakEventRowHeight,
  tweakEventBackgroundOpacity: actions.tweakEventBackgroundOpacity,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditorStatusBar));
