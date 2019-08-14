import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import {
  getEventSelectionMode,
  getEventSelectionModeTrackId,
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
  selectionMode,
  selectionModeTrackId,
  selectedTool,
  selectedColor,
  placeEvent,
  deleteEvent,
  bulkDeleteEvent,
  selectEvent,
  deselectEvent,
  switchEventColor,
  startManagingEventSelection,
  finishManagingEventSelection,
  ...delegated
}) => {
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
    if (selectionMode) {
      return;
    }

    placeEvent(...getPropsForPlacedEvent());
  };

  React.useEffect(() => {
    if (selectionMode === 'place' && selectionModeTrackId === trackId) {
      // TODO: Technically this should be a new action, bulkPlaceEVent, so that
      // they can all be undoed in 1 step
      placeEvent(...getPropsForPlacedEvent());
    }
    // eslint-disable-next-line
  }, [selectionMode, cursorAtBeat]);

  return (
    <Wrapper
      style={{ height }}
      onClick={handleClickTrack}
      onPointerDown={ev => {
        if (ev.buttons === 1) {
          startManagingEventSelection('place', trackId);
        } else if (ev.buttons === 2) {
          startManagingEventSelection('delete');
        }
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
  const selectionMode = getEventSelectionMode(state);
  const selectionModeTrackId = getEventSelectionModeTrackId(state);
  const selectedTool = getSelectedEventTool(state);
  const selectedColor = getSelectedEventColor(state);

  return {
    events,
    selectionMode,
    selectionModeTrackId,
    selectedTool,
    selectedColor,
  };
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
  selectEvent: actions.selectEvent,
  deselectEvent: actions.deselectEvent,
  switchEventColor: actions.switchEventColor,
  startManagingEventSelection: actions.startManagingEventSelection,
  finishManagingEventSelection: actions.finishManagingEventSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockTrack);
