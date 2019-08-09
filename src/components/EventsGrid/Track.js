import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { COLORS } from '../../constants';
import { getEventsForTrack } from '../../reducers/editor-entities.reducer/events-view.reducer';

import LightingOnBlock from './LightingOnBlock';

const BLOCK_MAP = {
  on: LightingOnBlock,
};

const EventsGridTrack = ({
  type,
  startBeat,
  numOfBeatsToShow,
  height,
  events,
  ...delegated
}) => {
  return (
    <Wrapper style={{ height }} {...delegated}>
      {events.map(ev => {
        const Component = BLOCK_MAP[ev.type];

        return (
          <Component
            key={ev.id}
            startBeat={startBeat}
            numOfBeatsToShow={numOfBeatsToShow}
            event={ev}
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

  return { events };
};

export default connect(mapStateToProps)(EventsGridTrack);
