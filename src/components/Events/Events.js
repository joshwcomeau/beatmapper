import React from 'react';
import styled from 'styled-components';

import { SIDEBAR_WIDTH, UNIT } from '../../constants';
import useWindowDimensions from '../../hooks/use-window-dimensions.hook';

import EventsGrid from '../EventsGrid';
import SongInfo from '../SongInfo';
import Spacer from '../Spacer';

import BottomPanel from './BottomPanel';
import TopPanel from './TopPanel';

const Events = ({}) => {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - SIDEBAR_WIDTH - UNIT * 4 * 2;

  return (
    <Wrapper>
      <TopArea style={{ width: contentWidth }}>
        <SongInfoWrapper>
          <SongInfo />
        </SongInfoWrapper>

        <Spacer size={UNIT * 4} />

        <TopPanel />
      </TopArea>
      <EventsGrid
        contentWidth={contentWidth}
        zoomLevel={3}
        events={[]}
        durationInBeats={100}
      />
      <BottomPanel />
    </Wrapper>
  );
};

const TopArea = styled.div`
  display: flex;
`;

const SongInfoWrapper = styled.div`
  padding-top: ${UNIT * 4}px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default Events;
