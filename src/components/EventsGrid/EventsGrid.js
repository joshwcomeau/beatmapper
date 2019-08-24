import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT, COLORS } from '../../constants';
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

const LAYERS = {
  background: 0,
  mouseCursor: 1,
  tracks: 2,
  songPositionIndicator: 3,
};

const TRACKS = [
  {
    id: 'laserSpeedLeft',
    label: 'Left laser speed',
    type: 'speed',
  },
  {
    id: 'laserLeft',
    label: 'Left laser',
    type: 'blocks',
  },

  {
    id: 'laserRight',
    label: 'Right laser',
    type: 'blocks',
  },
  {
    id: 'laserSpeedRight',
    label: 'Right laser speed',
    type: 'speed',
  },
  {
    id: 'laserBack',
    label: 'Back laser',
    type: 'blocks',
  },
  {
    id: 'primaryLight',
    label: 'Primary light',
    type: 'blocks',
  },
  {
    id: 'trackNeons',
    label: 'Track neons',
    type: 'blocks',
  },
  {
    id: 'largeRing',
    label: 'Large ring',
    type: 'blocks',
  },
  {
    id: 'smallRing',
    label: 'Small ring',
    type: 'blocks',
  },
];

const PREFIX_WIDTH = 170;

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
  finishManagingEventSelection,
  moveMouseAcrossEventsGrid,
  drawSelectionBox,
  commitSelection,
}) => {
  const innerGridWidth = contentWidth - PREFIX_WIDTH;
  // TODO: Dynamic height?
  const blockTrackHeight = 48;
  const speedTrackHeight = 48;
  const headerHeight = 32;
  const innerGridHeight = blockTrackHeight * 7 + speedTrackHeight * 2;

  const beatNums = range(Math.floor(startBeat), Math.ceil(endBeat));

  const [mouseDownAt, setMouseDownAt] = React.useState(null);
  const [mousePosition, setMousePosition] = React.useState(null);
  const mouseButtonDepressed = React.useRef(null); // 'left' | 'middle' | 'right'

  const tracksRef = useMousePositionOverElement((x, y) => {
    const currentMousePosition = { x, y };
    setMousePosition(currentMousePosition);

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

      drawSelectionBox(newSelectionBox);
    }

    const positionInBeats = normalize(x, 0, innerGridWidth, 0, beatNums.length);
    const roundedPositionInBeats = roundToNearest(positionInBeats, snapTo);
    const hoveringOverBeatNum = roundedPositionInBeats + startBeat;

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

  // I can click on a block to start selecting it.
  // If I hold the mouse down, I can drag to select (or deselect) many notes
  // at a time.
  // For this to work, I need to know when they start clicking and stop
  // clicking. For starting clicking, I can use the `SELECT_NOTE` action,
  // triggered when clicking a block... but they might not be over a block
  // when they release the mouse. So instead I need to use a mouseUp handler
  // up here.
  React.useEffect(() => {
    // TODO: Make this 'ifMouseDOwn', something something local state?
    if (!selectedEditMode) {
      return;
    }

    const handleMouseUp = () => {
      // Wait 1 frame before wrapping up. This is to prevent the selection
      // mode from changing before all event-handlers have been processed.
      // Without the delay, the user might accidentally add notes to the
      // placement grid - further up in the React tree - if they release the
      // mouse while over a grid tile.
      window.requestAnimationFrame(finishManagingEventSelection);
    };

    window.addEventListener('mouseup', handleMouseUp);

    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [selectedEditMode, finishManagingEventSelection]);

  const handleGridPointerDown = ev => {
    if (ev.button === 0) {
      mouseButtonDepressed.current = 'left';
    } else if (ev.button === 2) {
      mouseButtonDepressed.current = 'right';
    } else {
      // TODO: Middle button support?
      mouseButtonDepressed.current = 'left';
    }

    setMouseDownAt(mousePosition);
  };

  const handleGridPointerUp = ev => {
    mouseButtonDepressed.current = null;
    setMouseDownAt(null);

    console.log('pointer up');

    if (selectionBox) {
      commitSelection();
    }
  };

  return (
    <Wrapper isLoading={isLoading} style={{ width: contentWidth }}>
      <PrefixColumn style={{ width: PREFIX_WIDTH }}>
        <Header style={{ height: headerHeight }} />

        {TRACKS.map(({ id, type, label }) => (
          <TrackPrefix
            key={id}
            style={{
              height: type === 'blocks' ? blockTrackHeight : speedTrackHeight,
            }}
          >
            {label}
          </TrackPrefix>
        ))}
      </PrefixColumn>

      <Grid>
        <Header style={{ height: headerHeight }}>
          {beatNums.map(num => (
            <HeaderCell key={num}>
              <BeatNums>{num}</BeatNums>
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
            onPointerDown={handleGridPointerDown}
            onPointerUp={handleGridPointerUp}
          >
            {TRACKS.map(({ id, type }) => {
              const TrackComponent =
                type === 'blocks' ? BlockTrack : SpeedTrack;

              return (
                <TrackComponent
                  key={id}
                  trackId={id}
                  width={innerGridWidth}
                  height={
                    type === 'blocks' ? blockTrackHeight : speedTrackHeight
                  }
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
  finishManagingEventSelection: actions.finishManagingEventSelection,
  moveMouseAcrossEventsGrid: actions.moveMouseAcrossEventsGrid,
  drawSelectionBox: actions.drawSelectionBox,
  commitSelection: actions.commitSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsGrid);
