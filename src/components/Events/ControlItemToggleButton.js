import React from 'react';
import styled from 'styled-components';

import Heading from '../Heading';

const ControlItemToggleButton = ({ value, isToggled, onToggle, children }) => {
  return (
    <Wrapper
      style={{
        borderColor: isToggled
          ? 'rgba(255, 255, 255, 1)'
          : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 28px;
  height: 28px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export default ControlItemToggleButton;
