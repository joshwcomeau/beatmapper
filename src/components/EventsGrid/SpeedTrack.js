import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { range } from '../../utils';
import {
  getEventSelectionMode,
  getEventSelectionModeTrackId,
} from '../../reducers/editor.reducer';
import {
  getEventsForTrack,
  getTrackSpeedAtBeat,
} from '../../reducers/editor-entities.reducer/events-view.reducer';
import useMousePositionOverElement from '../../hooks/use-mouse-position-over-element.hook';

const NUM_OF_SPEEDS = 8;

const SpeedTrack = ({
  trackId,
  width,
  height,
  startBeat,
  numOfBeatsToShow,
  cursorAtBeat,
  events,
  startSpeed,
  endSpeed,
  selectionMode,
  placeEvent,
  deleteEvent,
  bulkDeleteEvent,
  startManagingEventSelection,
  ...delegated
}) => {
  const cursorAtSpeed = React.useRef(null);
  const clickedSpeed = React.useRef(null);

  const ref = useMousePositionOverElement((_, y) => {
    // We don't care about x, since we already have that under `cursorAtBeat`.
    // We need to know which vertical bar they're closest to.
    // `y` will be a number from 0 to `height`, where 0 is the top and `height`
    // is the bottom. Start by flipping this, since we want speed to increase
    // from bottom to top.
    const invertedY = height - y;
    cursorAtSpeed.current = Math.round(invertedY / (NUM_OF_SPEEDS - 2));
  });

  const handleClick = ev => {
    // TODO: use pointerdown so that I can let the user tweak before releasing
    // the mouse and confirming the placement.
    placeEvent(
      trackId,
      cursorAtBeat,
      'change-speed',
      null,
      cursorAtSpeed.current
    );
  };

  let plottablePoints = [
    {
      x: 0,
      y: 7 - startSpeed,
    },
  ];

  console.log(events);

  events.forEach((event, index) => {
    const previousLaserSpeed = plottablePoints[plottablePoints.length - 1].y;

    plottablePoints.push(
      {
        x: event.beatNum,
        y: previousLaserSpeed,
      },
      {
        x: event.beatNum,
        y: 7 - event.laserSpeed,
      }
    );
  });

  plottablePoints.push(
    {
      x: numOfBeatsToShow,
      y: 7 - endSpeed,
    },
    {
      x: numOfBeatsToShow,
      y: 7,
    },
    {
      x: 0,
      y: 7 - endSpeed,
    }
  );

  return (
    <Wrapper
      ref={ref}
      style={{ height }}
      onClick={handleClick}
      onPointerDown={ev => {
        if (ev.buttons === 2) {
          startManagingEventSelection('delete');
        }
      }}
      onContextMenu={ev => ev.preventDefault()}
    >
      <Background
        width={width}
        height={height}
        viewBox={`0 0 ${numOfBeatsToShow} 8`}
        preserveAspectRatio="none"
      >
        {range(NUM_OF_SPEEDS).map(i => (
          <line
            key={i}
            x1={0}
            y1={7 - i}
            x2={numOfBeatsToShow}
            y2={7 - i}
            strokeWidth={8 / height}
            stroke={COLORS.blueGray[700]}
            style={{ opacity: 0.6 }}
          />
        ))}

        <polyline
          points={plottablePoints.reduce((acc, point) => {
            return `${acc} ${point.x},${point.y}`;
          }, '')}
          stroke="white"
          strokeWidth="0.2"
          fill="none"
        />
      </Background>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLORS.blueGray[400]};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Background = styled.svg`
  position: relative;
  display: block;
  z-index: -10;
`;

const mapStateToProps = (state, ownProps) => {
  const events = getEventsForTrack(
    state,
    ownProps.trackId,
    ownProps.startBeat,
    ownProps.numOfBeatsToShow
  );
  const startSpeed = getTrackSpeedAtBeat(
    state,
    ownProps.trackId,
    ownProps.startBeat
  );
  const endSpeed = getTrackSpeedAtBeat(
    state,
    ownProps.trackId,
    ownProps.startBeat + ownProps.numOfBeatsToShow
  );
  const selectionMode = getEventSelectionMode(state);
  const selectionModeTrackId = getEventSelectionModeTrackId(state);

  return {
    events,
    startSpeed,
    endSpeed,
    selectionMode,
    selectionModeTrackId,
  };
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
  startManagingEventSelection: actions.startManagingEventSelection,
  finishManagingEventSelection: actions.finishManagingEventSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeedTrack);
