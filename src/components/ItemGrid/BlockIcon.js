import React from 'react';
import styled from 'styled-components';

const BlockIcon = ({ color, size = 16 }) => {
  return (
    <Block
      color={color}
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        padding: size / 8,
      }}
    >
      <svg width={size - size / 4} height={size - size / 4} viewBox="0 0 12 12">
        <path d="M0,0 L12,0 L6,4 Z" fill="#FFF" />
      </svg>
    </Block>
  );
};

const Block = styled.div`
  border-radius: 4px;
  background-color: ${props => props.color};
  padding: 2px;
`;

export default BlockIcon;
