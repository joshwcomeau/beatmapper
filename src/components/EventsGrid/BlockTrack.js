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
import { getEventsForTrack } from '../../reducers/editor-entities.reducer/events-view.reducer';

import EventBlock from './EventBlock';

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
  placeEvent,
  ...delegated
}) => {
  const [mouseButtonDepressed, setMouseButtonDepressed] = React.useState(null);

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

  const handlePointerUp = React.useCallback(() => {
    setMouseButtonDepressed(null);
  }, []);

  React.useEffect(() => {
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerUp]);

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

        window.addEventListener('pointerup', handlePointerUp);
      }}
      onContextMenu={ev => ev.preventDefault()}
    >
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

  return {
    events,
    selectedEditMode,
    selectedTool,
    selectedColor,
  };
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(BlockTrack));
