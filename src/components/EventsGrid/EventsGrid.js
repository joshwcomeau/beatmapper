import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { UNIT, COLORS } from '../../constants';
import { range, normalize, roundToNearest } from '../../utils';
import { getSnapTo } from '../../reducers/navigation.reducer';
import { getStartAndEndBeat } from '../../reducers/editor.reducer';
import useBoundingBox from '../../hooks/use-bounding-box.hook';

import BackgroundLines from './BackgroundLines';
import CursorPositionIndicator from './CursorPositionIndicator';
import Track from './Track';

const TRACKS = [
  {
    id: 'laser-left',
    label: 'Left laser',
    type: 'side-laser',
  },
  {
    id: 'laser-right',
    label: 'Right laser',
    type: 'side-laser',
  },
  {
    id: 'laser-back',
    label: 'Back laser',
    type: 'center-laser',
  },
  {
    id: 'primary-light',
    label: 'Primary light',
    type: 'center-laser',
  },
  {
    id: 'track-neons',
    label: 'Track neons',
    type: 'track-neons',
  },
  {
    id: 'large-ring',
    label: 'Large ring',
    type: 'ring',
  },
  {
    id: 'small-ring',
    label: 'Small ring',
    type: 'ring',
  },
];

const EventsGrid = ({
  contentWidth,
  zoomLevel = 3,
  events,
  startBeat,
  endBeat,
  numOfBeatsToShow,
  snapTo,
}) => {
  const [tracksRef, tracksBoundingBox] = useBoundingBox();
  const [mouseCursorPosition, setMouseCursorPosition] = React.useState(null);

  const prefixWidth = 170;
  const innerGridWidth = contentWidth - prefixWidth;
  // TODO: Dynamic height?
  const trackHeight = 40;
  const headerHeight = 32;
  const innerGridHeight = trackHeight * TRACKS.length;

  const beatNums = range(Math.floor(startBeat), Math.ceil(endBeat));

  const updateMouseCursorPosition = ev => {
    if (!tracksBoundingBox) {
      return;
    }

    const xPosition = ev.pageX - tracksBoundingBox.left;

    const positionInBeats = normalize(
      xPosition,
      0,
      innerGridWidth,
      0,
      beatNums.length
    );
    const roundedPositionInBeats = roundToNearest(positionInBeats, snapTo);

    const roundedPositionInPx = normalize(
      roundedPositionInBeats,
      0,
      beatNums.length,
      0,
      innerGridWidth
    );

    setMouseCursorPosition(roundedPositionInPx);
  };

  return (
    <Wrapper style={{ width: contentWidth }}>
      <PrefixColumn style={{ width: prefixWidth }}>
        <Header style={{ height: headerHeight }} />

        {TRACKS.map(({ id, label }) => (
          <TrackPrefix key={id} style={{ height: trackHeight }}>
            {label}
          </TrackPrefix>
        ))}
      </PrefixColumn>
      <Grid>
        <Header style={{ height: headerHeight }}>
          {beatNums.map(num => (
            <HeaderCell key={num}>
              <BeatNums>{num}</BeatNums>
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

          <Tracks
            ref={tracksRef}
            onMouseMove={updateMouseCursorPosition}
            onMouseLeave={() => setMouseCursorPosition(null)}
          >
            {TRACKS.map(({ id }) => (
              <Track key={id} height={trackHeight} />
            ))}
          </Tracks>

          <CursorPositionIndicator
            gridWidth={innerGridWidth}
            startBeat={startBeat}
            endBeat={endBeat}
          />

          {typeof mouseCursorPosition === 'number' && (
            <MouseCursor style={{ left: mouseCursorPosition }} />
          )}
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

const BeatNums = styled.span`
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

const TrackPrefix = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.blueGray[100]};
  padding: 0 ${UNIT}px;
  border-bottom: 1px solid ${COLORS.blueGray[400]};
`;

const Tracks = styled.div`
  position: relative;
  z-index: 2;
`;

const MouseCursor = styled.div`
  position: absolute;
  top: 0;
  z-index: 6;
  width: 3px;
  height: 100%;
  background: ${COLORS.blueGray[100]};
  border: 1px solid ${COLORS.blueGray[900]};
  border-radius: 2px;
  pointer-events: none;
  transform: translateX(-1px);
`;

const mapStateToProps = (state, ownProps) => {
  const { startBeat, endBeat } = getStartAndEndBeat(state);
  const numOfBeatsToShow = endBeat - startBeat;

  return {
    startBeat,
    endBeat,
    numOfBeatsToShow,
    snapTo: getSnapTo(state),
  };
};

export default connect(mapStateToProps)(React.memo(EventsGrid));
