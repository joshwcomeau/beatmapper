import React from 'react';
import * as THREE from 'three';
import { useThree, useRender } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export function Bloom({ children }) {
  const { gl, camera, size } = useThree();
  const scene = React.useRef();
  const composer = React.useRef();
  React.useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene.current, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.5,
      0.4,
      0.85
    );

    gl.toneMappingExposure = 2.5;
    bloomPass.threshold = 0;
    bloomPass.strength = 4;
    bloomPass.radius = 0.75;

    composer.current.addPass(bloomPass);
  }, []); // eslint-disable-line

  React.useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useRender(() => {
    composer.current.render();
    // gl.autoClear = false;
    // gl.clearDepth();
    // gl.render(scene.current, camera);
  });
  return <scene ref={scene}>{children}</scene>;
}

export function NoBloom({ children }) {
  const scene = React.useRef();
  const { gl, camera } = useThree();
  useRender(() => {
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(scene.current, camera);
  });
  return <scene ref={scene}>{children}</scene>;
}

export default Bloom;
