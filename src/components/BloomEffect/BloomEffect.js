import React from 'react';
import * as THREE from 'three';
import { useRender, useThree, apply } from 'react-three-fiber';
import {
  RenderPass,
  EffectPass,
  BloomEffect,
  EffectComposer,
} from 'postprocessing';

apply({ EffectComposer, EffectPass, RenderPass });

const Effect = () => {
  const { gl, scene, camera, size } = useThree();
  const composer = React.useRef();
  const clock = React.useRef(new THREE.Clock());
  const bloomEffect = React.useRef(new BloomEffect());

  bloomEffect.current.distinction = 0.4;

  React.useEffect(() => {
    composer.current.setSize(size.width, size.height);
  }, [size]);

  const takeOverRendering = true;

  useRender(() => {
    composer.current.render(clock.current.getDelta());
  }, takeOverRendering);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
      <effectPass
        attachArray="passes"
        args={[camera, bloomEffect.current]}
        renderToScreen
      />
    </effectComposer>
  );
};

export default Effect;
