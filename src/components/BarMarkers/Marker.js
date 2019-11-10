import React from 'react';
import * as THREE from 'three';

import oswaldGlyphs from '../../assets/fonts/oswald.json';
import { SURFACE_WIDTH, BLOCK_COLUMN_WIDTH } from '../../constants';
import { DEFAULT_NUM_ROWS } from '../../helpers/grid.helpers';

const font = new THREE.Font(oswaldGlyphs);
const textGeometryOptions = {
  font,
  size: 0.4,
  height: 0.025,
  curveSegments: 2,
};

const Marker = ({ beatNum, offset, type }) => {
  const Y_PADDING = 0.0075;
  const yOffset = BLOCK_COLUMN_WIDTH * (DEFAULT_NUM_ROWS * -0.5) + Y_PADDING;

  const depth = type === 'beat' ? 0.2 : 0.08;

  const color = type === 'sub-beat' ? '#AAAAAA' : '#FFFFFF';

  const textPadding = 0.5;

  const label = String(beatNum);

  const overextendBy = type === 'beat' ? 0.3 : 0;
  const lineWidth = SURFACE_WIDTH + overextendBy;
  const xOffset = overextendBy / 2;

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[xOffset, yOffset, offset]}
      >
        <planeGeometry attach="geometry" args={[lineWidth, depth]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>

      {typeof beatNum === 'number' && (
        <mesh position={[SURFACE_WIDTH / 2 + textPadding, yOffset, offset]}>
          <textGeometry attach="geometry" args={[label, textGeometryOptions]} />
          <meshLambertMaterial attach="material" color="#AAA" />
        </mesh>
      )}
    </>
  );
};

export default React.memo(Marker);
