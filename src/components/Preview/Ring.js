import React from 'react';

const RingHalf = ({ side, size }) => {
  const length = size;
  const height = length / 3;
  const thickness = 0.4;

  // If this is the bottom half, we need to rotate the whole thing 180deg.
  const rotation = side === 'bottom' ? [0, 0, Math.PI] : [0, 0, 0];

  return (
    <group rotation={rotation}>
      {/* Long beam */}
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry attach="geometry" args={[length, thickness, thickness]} />
        <meshLambertMaterial attach="material" color="#333" />
      </mesh>

      {/* Stubby legs */}
      <mesh
        position={[-length / 2 + thickness / 2, length / 2 - height / 2, 0]}
        rotation={[0, 0, Math.PI * 0.5]}
      >
        <boxGeometry attach="geometry" args={[height, thickness, thickness]} />
        <meshLambertMaterial attach="material" color="#333" />
      </mesh>
      <mesh
        position={[length / 2 - thickness / 2, length / 2 - height / 2, 0]}
        rotation={[0, 0, Math.PI * 0.5]}
      >
        <boxGeometry attach="geometry" args={[height, thickness, thickness]} />
        <meshLambertMaterial attach="material" color="#333" />
      </mesh>
    </group>
  );
};

const Ring = ({
  size = 12,
  x = 0,
  y = -2,
  z = -8,
  rotation = Math.PI * 0.25,
}) => {
  // Each ring consists of 2 identical-but-mirrored pieces, each the shape of
  // an unused staple:
  // [ ]

  return (
    <group position={[x, y, z]} rotation={[0, 0, rotation]}>
      <RingHalf size={size} />
      <RingHalf side="bottom" size={size} />
    </group>
  );
};

export default Ring;
