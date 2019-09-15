import React from 'react';

import { range } from '../../utils';

import Ring from './Ring';

const SmallRings = ({ numOfRings = 16 }) => {
  const distanceBetweenRings = -4;
  const firstRingOffset = -8;

  const initialRotation = Math.PI * 0.25;

  return range(numOfRings).map(index => (
    <Ring
      size={12}
      y={-2}
      z={firstRingOffset + distanceBetweenRings * index}
      rotation={initialRotation + index * 0.1}
    />
  ));
};

export default SmallRings;
