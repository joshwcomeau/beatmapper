import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import {
  getSelectedEventEditMode,
  getSelectedEventTool,
  getSelectedEventColor,
} from '../../reducers/editor.reducer';
import {
  getEventsForTrack,
  getInitialLightingValue,
} from '../../reducers/editor-entities.reducer/events-view.reducer';
import usePointerUpHandler from '../../hooks/use-pointer-up-handler.hook';

import EventBlock from './EventBlock';
import BackgroundBox from './BackgroundBox';
import { getBackgroundBoxes } from './BlockTrack.helpers';

const BlockTrack = ({
  trackId,
  height,
  startBeat,
  numOfBeatsToShow,
  cursorAtBeat,
  events,
  selectedTool,
  selectedColor,
  selectedEditMode,
  initialLightingValue,
  placeEvent,
  ...delegated
}) => {
  const [mouseButtonDepressed, setMouseButtonDepressed] = React.useState(null);

  const handlePointerUp = React.useCallback(() => {
    setMouseButtonDepressed(null);
  }, []);

  usePointerUpHandler(!!mouseButtonDepressed, handlePointerUp);

  const getPropsForPlacedEvent = () => {
    const isRingEvent = trackId === 'largeRing' || trackId === 'smallRing';
    const eventType = isRingEvent ? 'rotate' : selectedTool;

    let eventColor = selectedColor;
    if (isRingEvent || selectedTool === 'off') {
      eventColor = undefined;
    }

    return [trackId, cursorAtBeat, eventType, eventColor];
  };

  const handleClickTrack = () => {
    placeEvent(...getPropsForPlacedEvent());
  };

  React.useEffect(() => {
    if (selectedEditMode === 'place' && mouseButtonDepressed === 'left') {
      // TODO: Technically this should be a new action, bulkPlaceEVent, so that
      // they can all be undoed in 1 step
      placeEvent(...getPropsForPlacedEvent());
    }
    // eslint-disable-next-line
  }, [selectedEditMode, cursorAtBeat]);

  const backgroundBoxes = getBackgroundBoxes(
    events,
    initialLightingValue,
    startBeat,
    numOfBeatsToShow
  );

  return (
    <Wrapper
      style={{ height }}
      onPointerDown={ev => {
        if (selectedEditMode === 'select') {
          return;
        }

        if (ev.buttons === 1) {
          handleClickTrack();
          setMouseButtonDepressed('left');
        } else if (ev.buttons === 2) {
          setMouseButtonDepressed('right');
        }
      }}
      onContextMenu={ev => ev.preventDefault()}
    >
      {backgroundBoxes.map(box => (
        <BackgroundBox
          key={box.id}
          box={box}
          startBeat={startBeat}
          numOfBeatsToShow={numOfBeatsToShow}
        />
      ))}

      {events.map(event => {
        return (
          <EventBlock
            key={event.id}
            event={event}
            trackId={trackId}
            startBeat={startBeat}
            numOfBeatsToShow={numOfBeatsToShow}
            deleteOnHover={
              selectedEditMode === 'place' && mouseButtonDepressed === 'right'
            }
          />
        );
      })}
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

const mapStateToProps = (state, ownProps) => {
  const events = getEventsForTrack(
    state,
    ownProps.trackId,
    ownProps.startBeat,
    ownProps.numOfBeatsToShow
  );
  const selectedEditMode = getSelectedEventEditMode(state);
  const selectedTool = getSelectedEventTool(state);
  const selectedColor = getSelectedEventColor(state);

  const initialLightingValue = getInitialLightingValue(
    state,
    ownProps.trackId,
    ownProps.startBeat
  );

  return {
    events,
    selectedEditMode,
    selectedTool,
    selectedColor,
    initialLightingValue,
  };
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(BlockTrack));
