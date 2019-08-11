import React from 'react';
import styled from 'styled-components';

import UnstyledButton from '../UnstyledButton';

const ControlItemToggleButton = ({ value, isToggled, onToggle, children }) => {
  return (
    <Wrapper
      style={{
        borderColor: isToggled
          ? 'rgba(255, 255, 255, 0.65)'
          : 'rgba(255, 255, 255, 0.2)',
        opacity: isToggled ? 1 : 0.65,
      }}
      onClick={() => onToggle(value)}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled(UnstyledButton)`
  padding: 4px;
  border: 1px solid;
  border-radius: 3px;
`;

export default ControlItemToggleButton;
