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
import { eye as showLightsIcon } from 'react-icons-kit/feather/eye';
import { eyeOff as hideLightsIcon } from 'react-icons-kit/feather/eyeOff';

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
import { getShowLightingPreview } from '../../reducers/editor.reducer';
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
  location,
}) => {
  const view = getViewFromLocation(location);

  let leftContent;
  let rightContent;

  console.log({ showLightingPreview });

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
  };
};

const mapDispatchToProps = {
  updatePlaybackSpeed: actions.updatePlaybackSpeed,
  updateBeatDepth: actions.updateBeatDepth,
  updateVolume: actions.updateVolume,
  toggleNoteTick: actions.toggleNoteTick,
  togglePreviewLightingInEventsView: actions.togglePreviewLightingInEventsView,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditorStatusBar));
