import React from 'react';
import * as THREE from 'three';

import { SONG_OFFSET } from '../../constants';

const Lighting = () => {
  const topLightTarget = new THREE.Object3D();
  topLightTarget.position.set(0, 50, -50);
  const midLightTarget = new THREE.Object3D();
  midLightTarget.position.set(0, 0, -20);

  return (
    <>
      <primitive object={midLightTarget} />
      <primitive object={topLightTarget} />

      {/* <spotLight
        intensity={0.15}
        position={[0, 20, 0]}
        target={topLightTarget}
        angle={1}
        penumbra={1}
      />
      <spotLight
        intensity={0.1}
        position={[0, 0, 20]}
        target={midLightTarget}
        angle={1}
        penumbra={1}
      /> */}

      <ambientLight intensity={0.2} />
    </>
  );
};

export default Lighting;
