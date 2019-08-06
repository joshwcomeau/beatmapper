import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const EventsGridTrack = ({
  type,
  events,
  height,
  handleClick,
  handleMouseMove,
}) => {
  return <Wrapper style={{ height }} />;
};

const Wrapper = styled.div`
  border-bottom: 1px solid ${COLORS.blueGray[400]};

  &:last-of-type {
    border-bottom: none;
  }
`;

export default React.memo(EventsGridTrack);
