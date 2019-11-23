import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { range, normalize } from '../../utils';
import { getSelectedEventEditMode } from '../../reducers/editor.reducer';
import {
  makeGetEventsForTrack,
  getTrackSpeedAtBeat,
} from '../../reducers/editor-entities.reducer/events-view.reducer';
import useMousePositionOverElement from '../../hooks/use-mouse-position-over-element.hook';
import usePointerUpHandler from '../../hooks/use-pointer-up-handler.hook';

import { getYForSpeed } from './EventsGrid.helpers';
import SpeedTrackEvent from './SpeedTrackEvent';

const NUM_OF_SPEEDS = 7;
const INITIAL_TENTATIVE_EVENT = {
  id: 'tentative',
  beatNum: null,
  laserSpeed: null,
  visible: false,
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
  isDisabled,
  areLasersLocked,
  selectedEditMode,
  changeLaserSpeed,
  deleteEvent,
  bulkDeleteEvent,
  ...delegated
}) => {
  const [tentativeEvent, setTentativeEvent] = React.useState(
    INITIAL_TENTATIVE_EVENT
  );

  const commitChanges = React.useCallback(() => {
    changeLaserSpeed(
      trackId,
      tentativeEvent.beatNum,
      tentativeEvent.laserSpeed,
      areLasersLocked
    );

    setTentativeEvent(INITIAL_TENTATIVE_EVENT);
  }, [trackId, tentativeEvent, areLasersLocked, changeLaserSpeed]);

  usePointerUpHandler(tentativeEvent.visible, commitChanges);

  const ref = useMousePositionOverElement(
    (_, y) => {
      // We don't care about x, since we already have that under `cursorAtBeat`.
      // We need to know which vertical bar they're closest to.
      // `y` will be a number from 0 to `height`, where 0 is the top and `height`
      // is the bottom. Start by flipping this, since we want speed to increase
      // from bottom to top.
      const invertedY = height - y;
      const speed = Math.ceil(invertedY / (NUM_OF_SPEEDS - 2));

      if (speed !== tentativeEvent.laserSpeed) {
        setTentativeEvent({
          ...tentativeEvent,
          laserSpeed: speed,
        });
      }
    },
    { boxDependencies: [height] }
  );

  const handlePointerDown = ev => {
    if (isDisabled) {
      return;
    }

    if (ev.button !== 0 || selectedEditMode !== 'place') {
      return;
    }

    setTentativeEvent({
      ...tentativeEvent,
      beatNum: cursorAtBeat,
      visible: true,
    });
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
      isDisabled={isDisabled}
      onPointerDown={handlePointerDown}
      onContextMenu={ev => ev.preventDefault()}
    >
      <Svg width={width} height={height}>
        {/* Background 8 vertical lines, indicating the "levels" */}
        {!isDisabled && (
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
        )}

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
        {events.map(event => (
          <SpeedTrackEvent
            key={event.id}
            event={event}
            trackId={trackId}
            startBeat={startBeat}
            endBeat={startBeat + numOfBeatsToShow}
            parentWidth={width}
            parentHeight={height}
            areLasersLocked={areLasersLocked}
          />
        ))}

        {tentativeEvent.visible && (
          <SpeedTrackEvent
            event={tentativeEvent}
            trackId={trackId}
            startBeat={startBeat}
            endBeat={startBeat + numOfBeatsToShow}
            parentWidth={width}
            parentHeight={height}
            areLasersLocked={areLasersLocked}
          />
        )}
      </Svg>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLORS.blueGray[400]};
  opacity: ${p => p.isDisabled && 0.5};
  cursor: ${p => p.isDisabled && 'not-allowed'};
  background-color: ${p => p.isDisabled && 'rgba(255,255,255,0.2)'};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Svg = styled.svg`
  position: relative;
  display: block;
`;

const Background = styled.g``;

const makeMapStateToProps = (state, { trackId }) => {
  const getEventsForTrack = makeGetEventsForTrack(trackId);

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
    const selectedEditMode = getSelectedEventEditMode(state);

    return {
      events,
      startSpeed,
      endSpeed,
      selectedEditMode,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = {
  changeLaserSpeed: actions.changeLaserSpeed,
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SpeedTrack);
