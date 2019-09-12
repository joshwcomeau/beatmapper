import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const SelectionBox = ({ box }) => {
  const width = box.right - box.left;
  const height = box.bottom - box.top;

  return (
    <Box
      style={{
        width,
        height,
        top: box.top,
        left: box.left,
      }}
    />
  );
};

const Box = styled.div`
  position: absolute;
  z-index: 10;
  border: 2px dashed ${COLORS.white};
  border-radius: 5px;
  pointer-events: none;
`;

export default SelectionBox;
