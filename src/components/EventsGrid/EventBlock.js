import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';

import { COLORS } from '../../constants';
import * as actions from '../../actions';
import { getColorForItem } from '../../helpers/colors.helpers';
import { getSelectedEventEditMode } from '../../reducers/editor.reducer';
import { normalize } from '../../utils';

import UnstyledButton from '../UnstyledButton';
import { getSelectedSong } from '../../reducers/songs.reducer';

const BLOCK_WIDTH = 7;

const getBackgroundForEvent = (event, song) => {
  const color = getColorForItem(event.colorType || event.type, song);

  switch (event.type) {
    case 'on':
    case 'off':
    case 'rotate': {
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

    default:
      throw new Error('Unrecognized type: ' + event.type);
  }
};

const EventBlock = ({
  song,
  event,
  trackWidth,
  startBeat,
  numOfBeatsToShow,
  deleteOnHover,
  areLasersLocked,
  selectedEditMode,
  selectEvent,
  deselectEvent,
  bulkDeleteEvent,
  switchEventColor,
  deleteEvent,
}) => {
  const offset = normalize(
    event.beatNum,
    startBeat,
    numOfBeatsToShow + startBeat,
    0,
    trackWidth
  );

  const centeredOffset = offset - BLOCK_WIDTH / 2;

  const background = getBackgroundForEvent(event, song);

  return (
    <Wrapper
      style={{ transform: `translateX(${centeredOffset}px)`, background }}
      onClick={ev => ev.stopPropagation()}
      onContextMenu={ev => ev.preventDefault()}
      onPointerOver={ev => {
        if (deleteOnHover) {
          bulkDeleteEvent(event.id, event.trackId, areLasersLocked);
        }
      }}
      onPointerDown={ev => {
        // When in "select" mode, clicking the grid creates a selection box.
        // We don't want to do that when the user clicks directly on a block.
        // In "place" mode, we need the event to propagate to enable bulk
        // delete.
        if (selectedEditMode === 'select') {
          ev.stopPropagation();
        }

        // prettier-ignore
        const clickType = ev.button === 0
        ? 'left'
        : ev.button === 1
          ? 'middle'
          : ev.button === 2
            ? 'right'
            : undefined;

        if (clickType === 'left') {
          const actionToSend = event.selected ? deselectEvent : selectEvent;
          actionToSend(event.id, event.trackId);
        } else if (clickType === 'middle') {
          switchEventColor(event.id, event.trackId);
        } else if (clickType === 'right') {
          deleteEvent(event.id, event.trackId, areLasersLocked);
        }

        if (ev.buttons === 2) {
          deleteEvent(event.id, event.trackId, areLasersLocked);
        }
      }}
    >
      {event.selected && <SelectedGlow />}
    </Wrapper>
  );
};

const Wrapper = styled(UnstyledButton)`
  width: ${BLOCK_WIDTH}px;
  height: 100%;
  position: absolute;
  border-radius: ${BLOCK_WIDTH / 2}px;
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
  border-radius: ${BLOCK_WIDTH / 2}px;
  opacity: 0.6;
`;

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
    selectedEditMode: getSelectedEventEditMode(state),
  };
};

const mapDispatchToProps = {
  deleteEvent: actions.deleteEvent,
  bulkDeleteEvent: actions.bulkDeleteEvent,
  selectEvent: actions.selectEvent,
  deselectEvent: actions.deselectEvent,
  switchEventColor: actions.switchEventColor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(EventBlock));
