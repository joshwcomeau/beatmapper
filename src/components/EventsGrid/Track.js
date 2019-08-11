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
  getSelectedLaserSpeed,
} from '../../reducers/editor.reducer';
import { getEventsForTrack } from '../../reducers/editor-entities.reducer/events-view.reducer';

import EventBlock from './EventBlock';

const EventsGridTrack = ({
  trackId,
  height,
  type,
  startBeat,
  numOfBeatsToShow,
  cursorAtBeat,
  events,
  selectionMode,
  selectionModeTrackId,
  selectedTool,
  selectedColor,
  selectedLaserSpeed,
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

    return [trackId, cursorAtBeat, eventType, eventColor, selectedLaserSpeed];
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
        // TODO: Pattern blocks?

        return (
          <EventBlock
            key={event.id}
            event={event}
            startBeat={startBeat}
            numOfBeatsToShow={numOfBeatsToShow}
            onClick={ev => ev.stopPropagation()}
            onPointerOver={ev => {
              if (selectionMode === 'delete') {
                bulkDeleteEvent(event.id, event.trackId);
              } else if (selectionMode === 'select' && !event.selected) {
                selectEvent(event.id, event.trackId);
              } else if (selectionMode === 'deselect' && event.selected) {
                deselectEvent(event.id, event.trackId);
              }
            }}
            onPointerDown={ev => {
              ev.stopPropagation();

              // prettier-ignore
              const clickType = ev.button === 0
              ? 'left'
              : ev.button === 1
                ? 'middle'
                : ev.button === 2
                  ? 'right'
                  : undefined;

              let newSelectionMode;
              if (clickType === 'left') {
                newSelectionMode = event.selected ? 'deselect' : 'select';
              } else if (clickType === 'right') {
                newSelectionMode = 'delete';
              }
              if (newSelectionMode) {
                startManagingEventSelection(newSelectionMode);
              }

              if (clickType === 'left') {
                const actionToSend = event.selected
                  ? deselectEvent
                  : selectEvent;
                actionToSend(event.id, event.trackId);
              } else if (clickType === 'middle') {
                switchEventColor(event.id, event.trackId);
              } else if (clickType === 'right') {
                deleteEvent(event.id, event.trackId);
              }

              if (ev.buttons === 2) {
                deleteEvent(event.id, event.trackId);
              }
            }}
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
  const events = getEventsForTrack(state, ownProps.trackId);
  const selectionMode = getEventSelectionMode(state);
  const selectionModeTrackId = getEventSelectionModeTrackId(state);
  const selectedTool = getSelectedEventTool(state);
  const selectedColor = getSelectedEventColor(state);
  const selectedLaserSpeed = getSelectedLaserSpeed(state);

  return {
    events,
    selectionMode,
    selectionModeTrackId,
    selectedTool,
    selectedColor,
    selectedLaserSpeed,
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
)(EventsGridTrack);
