import React from 'react';
import styled from 'styled-components';

import { SIDEBAR_WIDTH, EVENTS_VIEW } from '../../constants';
import useWindowDimensions from '../../hooks/use-window-dimensions.hook';

import EventsGrid from '../EventsGrid';
import SongInfo from '../SongInfo';
import GlobalShortcuts from '../GlobalShortcuts';
import ReduxForwardingCanvas from '../ReduxForwardingCanvas';

import BottomPanel from './BottomPanel';
import GridControls from './GridControls';
import KeyboardShortcuts from './KeyboardShortcuts';
import EventLightingPreview from './EventLightingPreview';

const Events = () => {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - SIDEBAR_WIDTH;

  return (
    <>
      <Background>
        <EventLightingPreview />
      </Background>

      <Wrapper>
        <SongInfo showDifficultySelector={false} coverArtSize="small" />

        <MainUI>
          <GridControls contentWidth={contentWidth} />
          <EventsGrid contentWidth={contentWidth} />
          <BottomPanel contentWidth={contentWidth} />
        </MainUI>

        <GlobalShortcuts view={EVENTS_VIEW} />
        <KeyboardShortcuts />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const Background = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const MainUI = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: hsla(222, 32%, 4%, 0.8);
`;

export default Events;
