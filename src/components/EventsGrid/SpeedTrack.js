import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { range, normalize } from '../../utils';
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

const getYForSpeed = (height, speed) => {
  const divisionHeight = height / 8;
  return height - speed * divisionHeight;
};

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
  changeLaserSpeed,
  deleteEvent,
  bulkDeleteEvent,
  startManagingEventSelection,
  ...delegated
}) => {
  const cursorAtSpeed = React.useRef(null);

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
    changeLaserSpeed(trackId, cursorAtBeat, cursorAtSpeed.current);
  };

  let plottablePoints = [
    {
      x: 0,
      y: getYForSpeed(height, startSpeed),
    },
  ];

  events.forEach((event, index) => {
    const previousY = plottablePoints[plottablePoints.length - 1].y;

    const x = normalize(
      event.beatNum,
      startBeat,
      startBeat + numOfBeatsToShow,
      0,
      width
    );

    plottablePoints.push(
      {
        x: x,
        y: previousY,
      },
      {
        x: x,
        y: getYForSpeed(height, event.laserSpeed),
      }
    );
  });

  plottablePoints.push(
    {
      x: width,
      y: getYForSpeed(height, endSpeed),
    },
    {
      x: width,
      y: height,
    },
    {
      x: 0,
      y: height,
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
      <Svg width={width} height={height}>
        {/* Background 8 vertical lines, indicating the "levels" */}
        <Background>
          {range(NUM_OF_SPEEDS + 1).map(i => (
            <line
              key={i}
              x1={0}
              y1={getYForSpeed(height, i)}
              x2={width}
              y2={getYForSpeed(height, i)}
              strokeWidth={1}
              stroke={COLORS.blueGray[700]}
              style={{ opacity: 0.6 }}
            />
          ))}
        </Background>

        {/*
          The fill for our graph area, showing easily where the current speed
          is at.
        */}
        <polyline
          points={plottablePoints.reduce((acc, point) => {
            return `${acc} ${point.x},${point.y}`;
          }, '')}
          stroke="white"
          strokeWidth="0.2"
          fill={COLORS.green[500]}
          opacity={0.5}
        />

        {/*
          We also want to add little circles on every event. This'll allow the
          user to drag and change the position of events, as well as delete
          events they no longer want
        */}
        {events.map(event => {
          const x = normalize(
            event.beatNum,
            startBeat,
            startBeat + numOfBeatsToShow,
            0,
            width
          );
          const y = getYForSpeed(height, event.laserSpeed);

          return (
            <circle
              key={event.id}
              cx={x}
              cy={y}
              r={4}
              fill={COLORS.green[500]}
              style={{ cursor: 'pointer' }}
              onPointerDown={ev => {
                if (ev.button === 2) {
                  deleteEvent(event.id, trackId);
                }
              }}
            />
          );
        })}
      </Svg>
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

const Svg = styled.svg`
  position: relative;
  display: block;
`;

const Background = styled.g``;

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
  changeLaserSpeed: actions.changeLaserSpeed,
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
  startManagingEventSelection: actions.startManagingEventSelection,
  finishManagingEventSelection: actions.finishManagingEventSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeedTrack);
