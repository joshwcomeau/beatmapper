import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import {
  getSelectedEventTool,
  getSelectedEventColor,
  getSelectedLaserSpeed,
} from '../../reducers/editor.reducer';
import { getEventsForTrack } from '../../reducers/editor-entities.reducer/events-view.reducer';

import LightingBlock from './LightingBlock';

const BLOCK_MAP = {
  on: LightingBlock,
  off: LightingBlock,
};

const EventsGridTrack = ({
  trackId,
  height,
  type,
  startBeat,
  numOfBeatsToShow,
  cursorAtBeat,
  events,
  selectedTool,
  selectedColor,
  selectedLaserSpeed,
  placeEvent,
  ...delegated
}) => {
  const handleClickTrack = () => {
    const beatNum = startBeat + cursorAtBeat;

    // TODO: Validate that this tool makes sense for this track, choose the
    // right event type.
    const eventType = selectedTool;

    let eventColor = selectedColor;
    if (selectedTool === 'off') {
      eventColor = undefined;
    }

    placeEvent(trackId, beatNum, eventType, eventColor, selectedLaserSpeed);
  };

  return (
    <Wrapper style={{ height }} onClick={handleClickTrack}>
      {events.map(ev => {
        const Component = BLOCK_MAP[ev.type];

        return (
          <Component
            key={ev.id}
            event={ev}
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
  const events = getEventsForTrack(state, ownProps.trackId);
  const selectedTool = getSelectedEventTool(state);
  const selectedColor = getSelectedEventColor(state);
  const selectedLaserSpeed = getSelectedLaserSpeed(state);

  return { events, selectedTool, selectedColor, selectedLaserSpeed };
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsGridTrack);
