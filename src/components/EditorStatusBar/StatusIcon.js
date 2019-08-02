import React from 'react';
import { Icon } from 'react-icons-kit';
import styled from 'styled-components';

import UnstyledButton from '../UnstyledButton';

const StatusIcon = ({ icon, onClick, size = 16, opacity = 1, disabled }) =>
  console.log(opacity, disabled) || (
    <Wrapper
      onClick={disabled ? undefined : onClick}
      style={{
        opacity: disabled ? 0.4 : opacity,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
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
