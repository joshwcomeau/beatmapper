import React from 'react';

import { SURFACE_WIDTH, SURFACE_DEPTH, SONG_OFFSET } from '../../constants';

import RectAreaLight from '../RectAreaLight';

const StaticEnvironment = ({ includeEdgeStrips }) => {
  const PEG_WIDTH = 0.5;
  const SURFACE_Z_CENTER = SURFACE_DEPTH / 2 + SONG_OFFSET - 1;

  const PEG_X_OFFSET = SURFACE_WIDTH / 2 - PEG_WIDTH;

  const { current: leftRectLightPosition } = React.useRef([-2.95, -2.74, -30]);
  const { current: leftRectLightLookAt } = React.useRef([
    -2.95,
    -2.74 + 10,
    -30,
  ]);
  const { current: rightRectLightPosition } = React.useRef([2.95, -2.74, -30]);
  const { current: rightRectLightLookAt } = React.useRef([
    2.95,
    -2.74 + 10,
    -30,
  ]);

  return (
    <>
      {/* Surface */}
      <mesh position={[0, -3, -SURFACE_Z_CENTER]} receiveShadow>
        <boxGeometry
          attach="geometry"
          args={[SURFACE_WIDTH, 0.5, SURFACE_DEPTH]}
        />
        <meshStandardMaterial
          metalness={0.5}
          roughness={1}
          attach="material"
          color="#222222"
        />
      </mesh>

      {/* Pegs */}
      <mesh position={[-PEG_X_OFFSET, -13, -SURFACE_Z_CENTER]}>
        <boxGeometry
          attach="geometry"
          args={[0.5, 20, SURFACE_DEPTH - PEG_WIDTH * 4]}
        />
        <meshStandardMaterial
          metalness={0.1}
          roughness={0}
          attach="material"
          color="#222222"
        />
      </mesh>
      <mesh position={[PEG_X_OFFSET, -13, -SURFACE_Z_CENTER]}>
        <boxGeometry
          attach="geometry"
          args={[0.5, 20, SURFACE_DEPTH - PEG_WIDTH * 4]}
        />
        <meshStandardMaterial
          metalness={0.1}
          roughness={0}
          attach="material"
          color="#222222"
        />
      </mesh>

      {/* Edge light strips */}
      {includeEdgeStrips && (
        <>
          <RectAreaLight
            intensity={0.8}
            width={0.1}
            height={50}
            position={leftRectLightPosition}
            lookAt={leftRectLightLookAt}
          />
          <RectAreaLight
            intensity={0.8}
            width={0.1}
            height={50}
            position={rightRectLightPosition}
            lookAt={rightRectLightLookAt}
          />
        </>
      )}
    </>
  );
};

export default React.memo(StaticEnvironment);
