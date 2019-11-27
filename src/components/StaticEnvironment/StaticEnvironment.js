import React from 'react';
import { connect } from 'react-redux';

import {
  SURFACE_WIDTH,
  SURFACE_HEIGHT,
  SONG_OFFSET,
  BLOCK_COLUMN_WIDTH,
  SURFACE_DEPTHS,
} from '../../constants';
import { DEFAULT_NUM_ROWS } from '../../helpers/grid.helpers';

import EdgeStrip from './EdgeStrip';
import { getGraphicsLevel } from '../../reducers/user.reducer';

const StaticEnvironment = ({ surfaceDepth, includeEdgeStrips }) => {
  const gridYBase = BLOCK_COLUMN_WIDTH * (DEFAULT_NUM_ROWS * -0.5);

  const SURFACE_Z_CENTER = surfaceDepth / 2 + SONG_OFFSET - 1;

  const PEG_WIDTH = 0.5;
  const PEG_HEIGHT = 20;
  const PEG_DEPTH = surfaceDepth - PEG_WIDTH * 4;
  const PEG_X_OFFSET = SURFACE_WIDTH / 2 - PEG_WIDTH;

  const pegY = gridYBase - 10.25;

  const STRIP_PADDING = 0.01;
  const STRIP_WIDTH = 0.1;
  const STRIP_DEPTH = 50;
  const stripY = gridYBase + STRIP_PADDING;
  const stripX = SURFACE_WIDTH / 2 - STRIP_WIDTH / 2;

  return (
    <>
      {/* Surface */}
      <mesh
        position={[0, gridYBase - SURFACE_HEIGHT / 2, -SURFACE_Z_CENTER]}
        receiveShadow
      >
        <boxGeometry
          attach="geometry"
          args={[SURFACE_WIDTH, SURFACE_HEIGHT, surfaceDepth]}
        />
        <meshStandardMaterial
          metalness={0.5}
          roughness={1}
          attach="material"
          color="#222222"
        />
      </mesh>

      {/* Pegs */}
      <mesh position={[-PEG_X_OFFSET, pegY, -SURFACE_Z_CENTER]}>
        <boxGeometry
          attach="geometry"
          args={[PEG_WIDTH, PEG_HEIGHT, PEG_DEPTH]}
        />
        <meshStandardMaterial
          metalness={0.1}
          roughness={0}
          attach="material"
          color="#222222"
        />
      </mesh>
      <mesh position={[PEG_X_OFFSET, pegY, -SURFACE_Z_CENTER]}>
        <boxGeometry
          attach="geometry"
          args={[PEG_WIDTH, PEG_HEIGHT, PEG_DEPTH]}
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
          <EdgeStrip
            x={stripX}
            y={stripY}
            width={STRIP_WIDTH}
            depth={STRIP_DEPTH}
          />
          <EdgeStrip
            x={stripX * -1}
            y={stripY}
            width={STRIP_WIDTH}
            depth={STRIP_DEPTH}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  const graphicsLevel = getGraphicsLevel(state);
  const surfaceDepth = SURFACE_DEPTHS[graphicsLevel];

  return {
    surfaceDepth,
  };
};

export default connect(mapStateToProps)(StaticEnvironment);
