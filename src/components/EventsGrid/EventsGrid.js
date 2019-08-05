import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { UNIT, COLORS } from '../../constants';
import { range, floorToNearest } from '../../utils';
import { getEvents } from '../../reducers/editor-entities.reducer';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';
import useBoundingBox from '../../hooks/use-bounding-box.hook';
import BackgroundLines from './BackgroundLines';

const WINDOW_SIZES_FOR_ZOOM_LEVEL = [null, 32, 16, 8, 4];

const EventsGrid = ({
  contentWidth,
  zoomLevel = 3,
  events,
  cursorPositionInBeats,
  durationInBeats,
}) => {
  const prefixWidth = 170;
  const innerGridWidth = contentWidth - prefixWidth;
  // TODO: Dynamic height?
  const height = 500;
  const headerHeight = 32;
  const innerGridHeight = height - headerHeight;

  const numOfBeatsToShow = WINDOW_SIZES_FOR_ZOOM_LEVEL[zoomLevel];

  const startBeat = floorToNearest(cursorPositionInBeats, numOfBeatsToShow);
  const endBeat = startBeat + numOfBeatsToShow;

  const barNums = range(Math.floor(startBeat), Math.ceil(endBeat));

  return (
    <Wrapper style={{ width: contentWidth }}>
      <PrefixColumn style={{ width: prefixWidth }} />
      <Grid style={{ height }}>
        <Header style={{ height: headerHeight }}>
          {barNums.map(num => (
            <HeaderCell>
              <BarNum>{num}</BarNum>
              <Nub />
            </HeaderCell>
          ))}
        </Header>

        <MainGridContent style={{ height: innerGridHeight }}>
          <BackgroundLinesWrapper>
            <BackgroundLines
              width={innerGridWidth}
              height={innerGridHeight}
              numOfBeatsToShow={numOfBeatsToShow}
              primaryDivisions={4}
              secondaryDivisions={0}
            />
          </BackgroundLinesWrapper>
        </MainGridContent>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  background: ${COLORS.blueGray[900]};
`;

const PrefixColumn = styled.div`
  width: 170px;
  border-right: 2px solid rgba(255, 255, 255, 0.25);
`;

const Grid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLORS.blueGray[500]};
`;

const HeaderCell = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
`;

const BarNum = styled.span`
  display: inline-block;
  transform: translateX(-50%);
  padding-bottom: 8px;

  ${HeaderCell}:first-of-type & {
    display: none;
  }
`;

const Nub = styled.div`
  position: absolute;
  left: -1px;
  bottom: 0;
  width: 1px;
  height: 5px;
  background: ${COLORS.blueGray[500]};

  ${HeaderCell}:first-of-type & {
    display: none;
  }
`;

const MainGridContent = styled.div`
  flex: 1;
  position: relative;
`;

const BackgroundLinesWrapper = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const mapStateToProps = state => ({
  events: getEvents(state),
  cursorPositionInBeats: getCursorPositionInBeats(state),
});

export default connect(mapStateToProps)(EventsGrid);
