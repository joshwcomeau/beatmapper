import React from 'react';

import { range, convertDegreesToRadians } from '../../utils';

// Our LeftLaser actually consists of 4 individual beams.
// They're parallel when not moving

const Beam = ({ side, index }) => {
  const radius = 0.35;
  const height = 300;

  const startOffset = -100;
  const zDistanceBetweenBeams = 10;
  const xDistanceBetweenBeams = side === 'right' ? 2 : -2;

  const zPosition = startOffset + index * zDistanceBetweenBeams;
  const xPosition = index * xDistanceBetweenBeams;

  return (
    <group>
      <mesh
        position={[xPosition, 0, zPosition]}
        rotation={[0, 0, convertDegreesToRadians(side === 'right' ? 45 : -45)]}
      >
        <cylinderGeometry attach="geometry" args={[radius, radius, height]} />
        <meshLambertMaterial
          attach="material"
          emissive={side === 'right' ? 0xff0000 : 0x0000ff}
        />
      </mesh>
    </group>
  );
};

const LeftLaser = ({ side }) => {
  const radialSegments = 8;
  const heightSegments = 1;

  return (
    <>
      {range(0, 4).map(index => (
        <Beam key={index} side={side} index={index} />
      ))}
    </>
  );
};

export default LeftLaser;
