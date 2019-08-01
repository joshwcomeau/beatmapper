import React from 'react';
import * as THREE from 'three';

import RectAreaLightHelper from '../../vendor/rect-area-light-helper';

const RectAreaLight = ({
  color = '#FFFFFF',
  intensity = 10,
  width = 1,
  height = 1,
  position = [0, 0, -5],
  lookAt = [0, 0, 0],
}) => {
  const [light] = React.useState(
    () => new THREE.RectAreaLight(color, intensity, width, height)
  );
  const [helper] = React.useState(() => new RectAreaLightHelper(light));

  React.useEffect(() => {
    if (light) {
      light.add(helper);
    }
  }, [light, helper]);

  React.useEffect(() => {
    if (light) {
      light.position.set(...position);
      light.lookAt(...lookAt);
    }
  });

  return <>{light && <primitive object={light} />}</>;
};

export default RectAreaLight;
