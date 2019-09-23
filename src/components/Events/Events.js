import React from 'react';
import styled from 'styled-components';

import { SIDEBAR_WIDTH, EVENTS_VIEW } from '../../constants';
import useWindowDimensions from '../../hooks/use-window-dimensions.hook';

import EventsGrid from '../EventsGrid';
import SongInfo from '../SongInfo';
import GlobalShortcuts from '../GlobalShortcuts';

import BottomPanel from './BottomPanel';
import GridControls from './GridControls';
import KeyboardShortcuts from './KeyboardShortcuts';

const Events = () => {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - SIDEBAR_WIDTH;

  return (
    <Wrapper>
      <SongInfo showDifficultySelector={false} coverArtSize="small" />

      <GridControls contentWidth={contentWidth} />
      <EventsGrid contentWidth={contentWidth} />
      <BottomPanel contentWidth={contentWidth} />

      <GlobalShortcuts view={EVENTS_VIEW} />
      <KeyboardShortcuts />
    </Wrapper>
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

export default Events;
