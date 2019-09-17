import React from 'react';
import * as THREE from 'three';

import { SONG_OFFSET } from '../../constants';

const Lighting = () => {
  const frontLightTarget = new THREE.Object3D();
  frontLightTarget.position.set(0, 0, SONG_OFFSET);
  const midLightTarget = new THREE.Object3D();
  midLightTarget.position.set(0, 0, -20);

  return (
    <>
      <primitive object={midLightTarget} />
      <primitive object={frontLightTarget} />

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

export default Lighting;
