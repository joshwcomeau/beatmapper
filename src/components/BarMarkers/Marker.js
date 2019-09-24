import React from 'react';
import * as THREE from 'three';

import { SURFACE_WIDTH, BLOCK_COLUMN_WIDTH } from '../../constants';
import oswaldGlyphs from '../../assets/fonts/oswald.json';

const font = new THREE.Font(oswaldGlyphs);
const textGeometryOptions = {
  font,
  size: 0.4,
  height: 0.025,
  curveSegments: 2,
};

const HEIGHT = BLOCK_COLUMN_WIDTH * -1.5 + 0.01;

const Marker = ({ beatNum, offset, type }) => {
  const depth = type === 'beat' ? 0.2 : 0.08;

  const color = type === 'sub-beat' ? '#AAAAAA' : '#FFFFFF';

  const textPadding = 0.5;

  const label = String(beatNum);

  const lineWidth = SURFACE_WIDTH - 0.2;

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, HEIGHT, offset]}>
        <planeGeometry attach="geometry" args={[lineWidth, depth]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>

      {typeof beatNum === 'number' && (
        <mesh position={[SURFACE_WIDTH / 2 + textPadding, HEIGHT, offset]}>
          <textGeometry attach="geometry" args={[label, textGeometryOptions]} />
          <meshLambertMaterial attach="material" color="#AAA" />
        </mesh>
      )}
    </>
  );
};

export default React.memo(Marker);
