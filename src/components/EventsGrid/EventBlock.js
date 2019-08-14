import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';

import { COLORS } from '../../constants';
import * as actions from '../../actions';
import { getEventSelectionMode } from '../../reducers/editor.reducer';
import { normalize } from '../../utils';
import UnstyledButton from '../UnstyledButton';

const getBackgroundForEvent = event => {
  // prettier-ignore
  const color = event.color === 'red'
    ? COLORS.red[500]
    : event.color === 'blue'
      ? COLORS.blue[500]
      : COLORS.blueGray[400];

  switch (event.type) {
    case 'on':
    case 'off': {
      // On/off are solid colors
      return color;
    }

    case 'flash': {
      const brightColor = Color(color)
        .lighten(0.4)
        .hsl();
      const semiTransparentColor = Color(color)
        .darken(0.5)

        .hsl();
      return `linear-gradient(90deg, ${semiTransparentColor}, ${brightColor})`;
    }

    case 'fade': {
      const brightColor = Color(color)
        .lighten(0.4)
        .hsl();

      const semiTransparentColor = Color(color)
        .darken(0.5)

        .rgb();
      return `linear-gradient(-90deg, ${semiTransparentColor}, ${brightColor})`;
    }

    case 'rotate': {
      return COLORS.green[500];
    }

    default:
      throw new Error('Unrecognized type: ' + event.type);
  }
};

const EventBlock = ({
  event,
  startBeat,
  numOfBeatsToShow,
  selectionMode,
  selectEvent,
  deselectEvent,
  startManagingEventSelection,
  bulkDeleteEvent,
  switchEventColor,
  deleteEvent,
}) => {
  const offset = normalize(
    event.beatNum,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    100
  );

  const background = getBackgroundForEvent(event);

  return (
    <Wrapper
      style={{ left: offset + '%', background }}
      onClick={ev => ev.stopPropagation()}
      onContextMenu={ev => ev.preventDefault()}
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
          const actionToSend = event.selected ? deselectEvent : selectEvent;
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
    >
      {event.selected && <SelectedGlow />}
    </Wrapper>
  );
};

const Wrapper = styled(UnstyledButton)`
  width: 7px;
  height: 100%;
  position: absolute;
  border-radius: 4px;
  transform: translateX(-50%);
`;

const SelectedGlow = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${COLORS.yellow[500]};
  border-radius: 4px;
  opacity: 0.6;
`;

const mapStateToProps = (state, ownProps) => {
  const selectionMode = getEventSelectionMode(state);

  return { selectionMode };
};

const mapDispatchToProps = {
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
  selectEvent: actions.selectEvent,
  deselectEvent: actions.deselectEvent,
  switchEventColor: actions.switchEventColor,
  startManagingEventSelection: actions.startManagingEventSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(EventBlock));
