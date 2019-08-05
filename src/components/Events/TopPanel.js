import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

const PADDING = UNIT * 2;

const EventsTopPanel = ({ contentWidth }) => {
  return <Wrapper style={{ width: contentWidth }} />;
};

const Wrapper = styled.div`
  flex: 1;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: ${PADDING}px;
  background: rgba(255, 255, 255, 0.1);
  user-select: none;
`;

export default EventsTopPanel;
