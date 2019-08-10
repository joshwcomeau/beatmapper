import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { range } from '../../utils';

const BackgroundLines = ({
  width,
  height,
  numOfBeatsToShow,
  primaryDivisions,
  secondaryDivisions,
}) => {
  const segmentWidth = width / numOfBeatsToShow;
  const beatLines = range(numOfBeatsToShow).map(i => {
    // No line necessary for the right edge of the grid
    if (i === numOfBeatsToShow - 1) {
      return null;
    }
    return (
      <line
        key={i}
        x1={(i + 1) * segmentWidth}
        y1={-6}
        x2={(i + 1) * segmentWidth}
        y2={height}
        stroke={COLORS.blueGray[500]}
        strokeWidth={1}
      />
    );
  });

  const primaryLines = beatLines.map((_, segmentIndex) => {
    return range(primaryDivisions).map(i => {
      if (i === 0) {
        return null;
      }

      const subSegmentWidth = segmentWidth / primaryDivisions;

      return (
        <line
          key={i}
          x1={segmentIndex * segmentWidth + i * subSegmentWidth}
          y1={0}
          x2={segmentIndex * segmentWidth + i * subSegmentWidth}
          y2={height}
          stroke={COLORS.blueGray[700]}
          strokeWidth={1}
        />
      );
    });
  });

  return (
    <Svg width={width} height={height}>
      {beatLines}
      {primaryLines}
    </Svg>
  );
};

const Svg = styled.svg`
  display: block;
  overflow: visible;
`;

export default BackgroundLines;
