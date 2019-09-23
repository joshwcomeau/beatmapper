import React from 'react';
import * as THREE from 'three';

import { SURFACE_WIDTH, BLOCK_COLUMN_WIDTH } from '../../constants';
import oswaldGlyphs from '../../assets/fonts/oswald.json';

const font = new THREE.Font(oswaldGlyphs);
const textGeometryOptions = {
  font,
  size: 0.75,
  height: 0.1,
  curveSegments: 4,
};

const HEIGHT = BLOCK_COLUMN_WIDTH * -1.5 + 0.01;

const Marker = ({ barNum, offset, type }) => {
  const depth = type === 'bar' ? 0.3 : type === 'beat' ? 0.2 : 0.05;

  const color =
    type === 'bar' ? '#FFFFFF' : type === 'beat' ? '#AAAAAA' : '#333333';

  const textPadding = 0.5;

  const label = String(barNum);

  const lineWidth = SURFACE_WIDTH - 0.2;

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, HEIGHT, offset]}>
        <planeGeometry attach="geometry" args={[lineWidth, depth]} />
        <meshStandardMaterial attach="material" color={color} />
      </mesh>

      {typeof barNum === 'number' && (
        <mesh position={[SURFACE_WIDTH / 2 + textPadding, HEIGHT, offset]}>
          <textGeometry attach="geometry" args={[label, textGeometryOptions]} />
          <meshLambertMaterial attach="material" color="#AAA" />
        </mesh>
      )}
    </>
  );
};

export default React.memo(Marker);
