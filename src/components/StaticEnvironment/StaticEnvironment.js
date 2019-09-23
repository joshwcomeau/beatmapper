import React from 'react';
import * as THREE from 'three';

import {
  SURFACE_WIDTH,
  SURFACE_DEPTH,
  SONG_OFFSET,
  BLOCK_COLUMN_WIDTH,
} from '../../constants';

import RectAreaLight from '../RectAreaLight';

const GRID_Y_BASE = BLOCK_COLUMN_WIDTH * -1.5;

const StaticEnvironment = props => {
  const PEG_WIDTH = 0.5;
  const SURFACE_Z_CENTER = SURFACE_DEPTH / 2 + SONG_OFFSET - 1;

  const PEG_X_OFFSET = SURFACE_WIDTH / 2 - PEG_WIDTH;

  const STRIP_HEIGHT = GRID_Y_BASE + 0.01;

  const { current: leftRectLightPosition } = React.useRef([
    -2.95,
    STRIP_HEIGHT,
    -30,
  ]);
  const { current: leftRectLightLookAt } = React.useRef([
    -2.95,
    STRIP_HEIGHT + 10,
    -30,
  ]);
  const { current: rightRectLightPosition } = React.useRef([
    2.95,
    STRIP_HEIGHT,
    -30,
  ]);
  const { current: rightRectLightLookAt } = React.useRef([
    2.95,
    STRIP_HEIGHT + 10,
    -30,
  ]);

  const frontLightTarget = new THREE.Object3D();
  frontLightTarget.position.set(0, 0, SONG_OFFSET);
  const midLightTarget = new THREE.Object3D();
  midLightTarget.position.set(0, 0, -20);

  return (
    <>
      {/* Fog! Hide objects very far away. */}
      <fogExp2 attach="fog" args={[0x000000, 0.02]} />

      <primitive object={midLightTarget} />
      <primitive object={frontLightTarget} />

      {/* Surface */}
      <mesh position={[0, GRID_Y_BASE - 0.25, -SURFACE_Z_CENTER]} receiveShadow>
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
      <mesh position={[-PEG_X_OFFSET, -12.25, -SURFACE_Z_CENTER]}>
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
      <mesh position={[PEG_X_OFFSET, -12.25, -SURFACE_Z_CENTER]}>
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

      {/* Bright lights on the placement grid */}
      <spotLight
        castShadow
        intensity={0.6}
        position={[0, 30, SONG_OFFSET]}
        target={frontLightTarget}
        angle={0.5}
        penumbra={1}
      />
      <spotLight
        intensity={0.25}
        position={[0, 0, 20]}
        angle={1}
        penumbra={0}
      />

      <spotLight
        intensity={0.5}
        position={[50, 50, SONG_OFFSET - 30]}
        target={midLightTarget}
        angle={1}
        penumbra={1}
      />
      <spotLight
        intensity={0.5}
        position={[-50, 50, SONG_OFFSET - 30]}
        target={midLightTarget}
        angle={1}
        penumbra={1}
      />

      <ambientLight intensity={0.45} />
    </>
  );
};

export default React.memo(StaticEnvironment);
