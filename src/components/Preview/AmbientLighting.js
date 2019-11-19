import React from 'react';
import * as THREE from 'three';

const AmbientLighting = ({ includeSpotlight }) => {
  const midLightTarget = new THREE.Object3D();
  midLightTarget.position.set(0, -20, -20);

  return (
    <>
      <ambientLight intensity={0.2} />
      {includeSpotlight && (
        <>
          <primitive object={midLightTarget} />

          <spotLight
            intensity={0.5}
            position={[0, 20, 0]}
            target={midLightTarget}
            angle={1}
            penumbra={1}
          />
        </>
      )}
    </>
  );
};

export default AmbientLighting;
