import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT, COLORS, EVENT_TRACKS } from '../../constants';
import { range, normalize, roundToNearest } from '../../utils';
import { getIsLoading, getSnapTo } from '../../reducers/navigation.reducer';
import {
  getZoomLevel,
  getStartAndEndBeat,
  getSelectedEventEditMode,
  getSelectedEventBeat,
  getSelectionBox,
} from '../../reducers/editor.reducer';
import useMousePositionOverElement from '../../hooks/use-mouse-position-over-element.hook';

import BackgroundLines from './BackgroundLines';
import CursorPositionIndicator from './CursorPositionIndicator';
import BlockTrack from './BlockTrack';
import SpeedTrack from './SpeedTrack';
import SelectionBox from './SelectionBox';
import GridHeader from './GridHeader';

const LAYERS = {
  background: 0,
  mouseCursor: 1,
  tracks: 2,
  songPositionIndicator: 3,
};

const PREFIX_WIDTH = 170;

const convertMousePositionToBeatNum = (
  x,
  innerGridWidth,
  beatNums,
  startBeat,
  snapTo
) => {
  const positionInBeats = normalize(x, 0, innerGridWidth, 0, beatNums.length);

  let roundedPositionInBeats = positionInBeats;
  if (typeof snapTo === 'number') {
    roundedPositionInBeats = roundToNearest(positionInBeats, snapTo);
  }

  return roundedPositionInBeats + startBeat;
};

const EventsGrid = ({
  contentWidth,
  zoomLevel,
  events,
  startBeat,
  endBeat,
  selectedBeat,
  selectionBox,
  numOfBeatsToShow,
  isLoading,
  snapTo,
  selectedEditMode,
  moveMouseAcrossEventsGrid,
  drawSelectionBox,
  commitSelection,
}) => {
  const innerGridWidth = contentWidth - PREFIX_WIDTH;
  // TODO: Dynamic height?
  const trackHeight = 40;
  const headerHeight = 32;
  const innerGridHeight = trackHeight * EVENT_TRACKS.length;

  const beatNums = range(Math.floor(startBeat), Math.ceil(endBeat));

  const [mouseDownAt, setMouseDownAt] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState(null);
  const mouseButtonDepressed = React.useRef(null); // 'left' | 'middle' | 'right'

  const tracksRef = useMousePositionOverElement((x, y) => {
    const currentMousePosition = { x, y };
    setMousePosition(currentMousePosition);

    const hoveringOverBeatNum = convertMousePositionToBeatNum(
      x,
      innerGridWidth,
      beatNums,
      startBeat,
      snapTo
    );

    if (
      selectedEditMode === 'select' &&
      mouseDownAt &&
      mouseButtonDepressed.current === 'left'
    ) {
      const newSelectionBox = {
        top: Math.min(mouseDownAt.y, currentMousePosition.y),
        left: Math.min(mouseDownAt.x, currentMousePosition.x),
        right: Math.max(mouseDownAt.x, currentMousePosition.x),
        bottom: Math.max(mouseDownAt.y, currentMousePosition.y),
      };

      // Selection boxes need to include their cartesian values, in pixels, but
      // we should also encode the values in business terms: start/end beat,
      // and start/end track
      const startTrackIndex = Math.floor(newSelectionBox.top / trackHeight);
      const endTrackIndex = Math.floor(newSelectionBox.bottom / trackHeight);

      const start = convertMousePositionToBeatNum(
        newSelectionBox.left,
        innerGridWidth,
        beatNums,
        startBeat
      );

      const end = convertMousePositionToBeatNum(
        newSelectionBox.right,
        innerGridWidth,
        beatNums,
        startBeat
      );

      const newSelectionBoxInBeats = {
        startTrackIndex,
        endTrackIndex,
        startBeat: start,
        endBeat: end,
      };

      drawSelectionBox(newSelectionBox, newSelectionBoxInBeats);
    }

    if (hoveringOverBeatNum !== selectedBeat)
      moveMouseAcrossEventsGrid(hoveringOverBeatNum);
  });

  const mousePositionInPx = normalize(
    selectedBeat - startBeat,
    0,
    beatNums.length,
    0,
    innerGridWidth
  );

  const handlePointerDown = ev => {
    if (ev.button === 0) {
      mouseButtonDepressed.current = 'left';
    } else if (ev.button === 2) {
      mouseButtonDepressed.current = 'right';
    } else {
      // TODO: Middle button support?
      mouseButtonDepressed.current = 'left';
    }

    setMouseDownAt(mousePosition);

    function handlePointerUp() {
      mouseButtonDepressed.current = null;
      setMouseDownAt(null);

      commitSelection();

      window.removeEventListener('pointerup', handlePointerUp);
    }

    // HACK: I'm not cleaning up this event listener.
    // Surprisingly this gave me trouble, but I also think it's fine since the
    // user is unlikely to navigate away from this page while holding the
    // mouse button down from within the grid.
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <Wrapper isLoading={isLoading} style={{ width: contentWidth }}>
      <PrefixColumn style={{ width: PREFIX_WIDTH }}>
        <TopLeftBlankCell style={{ height: headerHeight }} />

        {EVENT_TRACKS.map(({ id, type, label }) => (
          <TrackPrefix
            key={id}
            style={{
              height: type === 'blocks' ? trackHeight : trackHeight,
            }}
          >
            {label}
          </TrackPrefix>
        ))}
      </PrefixColumn>

      <Grid>
        <GridHeader
          height={headerHeight}
          beatNums={beatNums}
          selectedBeat={selectedBeat}
        />

        <MainGridContent
          style={{
            height: innerGridHeight,
            cursor: selectedEditMode === 'select' ? 'crosshair' : 'pointer',
          }}
        >
          <BackgroundLinesWrapper>
            <BackgroundLines
              width={innerGridWidth}
              height={innerGridHeight}
              numOfBeatsToShow={numOfBeatsToShow}
              primaryDivisions={4}
              secondaryDivisions={0}
            />
          </BackgroundLinesWrapper>

          <Tracks ref={tracksRef} onPointerDown={handlePointerDown}>
            {EVENT_TRACKS.map(({ id, type }) => {
              const TrackComponent =
                type === 'blocks' ? BlockTrack : SpeedTrack;

              return (
                <TrackComponent
                  key={id}
                  trackId={id}
                  width={innerGridWidth}
                  height={type === 'blocks' ? trackHeight : trackHeight}
                  startBeat={startBeat}
                  numOfBeatsToShow={numOfBeatsToShow}
                  cursorAtBeat={selectedBeat}
                />
              );
            })}
          </Tracks>

          {selectionBox && <SelectionBox box={selectionBox} />}

          <CursorPositionIndicator
            gridWidth={innerGridWidth}
            startBeat={startBeat}
            endBeat={endBeat}
            zIndex={LAYERS.songPositionIndicator}
          />

          {typeof mousePositionInPx === 'number' && (
            <MouseCursor style={{ left: mousePositionInPx }} />
          )}
        </MainGridContent>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.45);
  opacity: ${props => (props.isLoading ? 0.25 : 1)};
  /*
    Disallow clicking until the song has loaded, to prevent weird edge-case bugs
  */
  pointer-events: ${props => (props.isLoading ? 'none' : 'auto')};
  /* Don't allow the track labels or beat nums to be selected */
  user-select: none;
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

const TopLeftBlankCell = styled.div`
  border-bottom: 1px solid ${COLORS.blueGray[500]};
`;

const MainGridContent = styled.div`
  flex: 1;
  position: relative;
`;

const BackgroundLinesWrapper = styled.div`
  position: absolute;
  z-index: ${LAYERS.background};
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

  &:last-of-type {
    border-bottom: none;
  }
`;

const Tracks = styled.div`
  position: relative;
  z-index: ${LAYERS.tracks};
`;

const MouseCursor = styled.div`
  position: absolute;
  top: 0;
  z-index: ${LAYERS.mouseCursor};
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
  const selectedEditMode = getSelectedEventEditMode(state);
  const selectedBeat = getSelectedEventBeat(state);

  return {
    startBeat,
    endBeat,
    selectedBeat,
    zoomLevel: getZoomLevel(state),
    numOfBeatsToShow,
    selectedEditMode,
    isLoading: getIsLoading(state),
    snapTo: getSnapTo(state),
    selectionBox: getSelectionBox(state),
  };
};

const mapDispatchToProps = {
  moveMouseAcrossEventsGrid: actions.moveMouseAcrossEventsGrid,
  drawSelectionBox: actions.drawSelectionBox,
  commitSelection: actions.commitSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsGrid);
