import React from 'react';
import { connect } from 'react-redux';

import {
  SURFACE_WIDTH,
  SURFACE_DEPTH,
  SONG_OFFSET,
  BLOCK_COLUMN_WIDTH,
} from '../../constants';
import { DEFAULT_NUM_ROWS } from '../../helpers/grid.helpers';
import { getGridSize } from '../../reducers/songs.reducer';

import EdgeStrip from './EdgeStrip';

const StaticEnvironment = ({ includeEdgeStrips, gridRows }) => {
  const gridYBase = BLOCK_COLUMN_WIDTH * (gridRows * -0.5);

  const PEG_WIDTH = 0.5;
  const SURFACE_Z_CENTER = SURFACE_DEPTH / 2 + SONG_OFFSET - 1;

  const PEG_X_OFFSET = SURFACE_WIDTH / 2 - PEG_WIDTH;

  const pegY = gridYBase - 10.25;
  const stripY = gridYBase + 0.011;

  return (
    <>
      {/* Surface */}
      <mesh position={[0, gridYBase - 0.25, -SURFACE_Z_CENTER]} receiveShadow>
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
      <mesh position={[-PEG_X_OFFSET, pegY, -SURFACE_Z_CENTER]}>
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
      <mesh position={[PEG_X_OFFSET, pegY, -SURFACE_Z_CENTER]}>
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
          <EdgeStrip x={-2.95} y={stripY} z={-30} />
          <EdgeStrip x={2.95} y={stripY} z={-30} />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.trackGridRows) {
    return {
      gridRows: DEFAULT_NUM_ROWS,
    };
  }

  const gridSize = getGridSize(state);

  return {
    gridRows: gridSize.numRows,
  };
};

export default connect(mapStateToProps)(StaticEnvironment);
