import React from 'react';
import { Icon } from 'react-icons-kit';
import styled from 'styled-components';

import UnstyledButton from '../UnstyledButton';

const StatusIcon = ({ icon, onClick, size = 16, opacity }) => (
  <Wrapper onClick={onClick} style={{ opacity }}>
    <Icon icon={icon} size={size} style={{ transform: 'translateY(-2px)' }} />
  </Wrapper>
);

const Wrapper = styled(UnstyledButton)`
  color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export default StatusIcon;
