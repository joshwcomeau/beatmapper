import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const Mouse = ({ width = 18, height = 27, activeButton }) => {
  return (
    <Wrapper>
      <svg width={width} height={height} viewBox="0 0 18 27" fill="none">
        <path
          d="M1 10H18V19C18 23.4183 14.4183 27 10 27H9C4.58172 27 1 23.4183 1 19V10Z"
          fill={COLORS.blueGray[300]}
        />
        <path
          d="M3 2.5C0.499984 5 0.999987 9 0.999987 9H8.99999V0C8.99999 0 5.50002 0 3 2.5Z"
          fill={
            activeButton === 'left' ? COLORS.pink[500] : COLORS.blueGray[300]
          }
        />
        <path
          d="M15.9695 2.5C18.4569 5 17.9594 9 17.9594 9H10V0C10 0 13.4822 0 15.9695 2.5Z"
          fill={
            activeButton === 'right' ? COLORS.pink[500] : COLORS.blueGray[300]
          }
        />
        {activeButton === 'scroll' && (
          <rect
            x={7.5}
            y={3}
            width={4}
            height={8}
            rx={2}
            ry={2}
            fill={COLORS.pink[500]}
            stroke="white"
            strokeWidth={2}
          />
        )}
        {activeButton === 'middle' && (
          <rect
            x={6}
            y={7}
            width={7}
            height={7}
            rx={2}
            ry={2}
            fill={COLORS.pink[500]}
            stroke="white"
            strokeWidth={2}
          />
        )}
      </svg>
      <Cable width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path
          d="M5.7264 11C5.7264 11 6.342 8.9278 5.7264 7.81818C4.86025 6.25698 2.11538 7.54906 1.2232 6C0.162898 4.15905 3.22462 1 3.22462 1"
          stroke={COLORS.blueGray[900]}
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </Cable>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  align-self: center;
`;

const Cable = styled.svg`
  position: absolute;
  width: 7px;
  height: 12px;
  margin: auto;
  left: -2px;
  right: 0;
  transform: translateY(-100%);
`;

export default Mouse;
