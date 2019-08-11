import React from 'react';
import styled from 'styled-components';

const getPathForTool = tool => {
  switch (tool) {
    case 'on':
      return 'M32 8H0V32H32V8Z';
    case 'off':
      return '';
    case 'flash':
      return 'M24.5 0C31.5 -9.68242e-05 32 8.5 32 8.5V32H0C0 32 17.5 9.68259e-05 24.5 0Z';
    case 'fade':
      return 'M7.49998 0C0.499969 -9.68242e-05 -1.52588e-05 8.5 -1.52588e-05 8.5V32H32C32 32 14.5 9.68259e-05 7.49998 0Z';
    default:
      throw new Error('Unrecognized tool: ' + tool);
  }
};

const EventToolIcon = ({ tool, color }) => {
  return (
    <Svg width={16} height={16} viewBox="0 0 32 32" fill="none">
      <rect
        x1={0}
        y1={0}
        width={32}
        height={32}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
      />
      <path d={getPathForTool(tool)} fill={color} stroke="none" />
    </Svg>
  );
};

const Svg = styled.svg`
  display: block;
`;

export default EventToolIcon;
