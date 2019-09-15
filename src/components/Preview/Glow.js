import React from 'react';
import * as THREE from 'three';
import { useThree } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring/three';

import { normalize } from '../../utils';

const ON_PROPS = { opacity: 0.75 };
const OFF_PROPS = { opacity: 0.5 };
const BRIGHT_PROPS = { opacity: 1 };

const getIntensityInfoForStatus = status => {
  switch (status) {
    case 'off':
      return {
        to: OFF_PROPS,
        immediate: true,
        reset: false,
      };

    case 'on': {
      return {
        to: ON_PROPS,
        immediate: true,
        reset: false,
      };
    }

    case 'flash': {
      return {
        from: BRIGHT_PROPS,
        to: ON_PROPS,
        immediate: false,
        reset: false,
      };
    }

    case 'fade': {
      return {
        from: BRIGHT_PROPS,
        to: OFF_PROPS,
        immediate: false,
        reset: false,
      };
    }

    default:
      throw new Error('Unrecognized status: ' + status);
  }
};

const vertexShader = `
uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
void main()
{
    vec3 vNormal = normalize( normalMatrix * normal );
	vec3 vNormel = normalize( normalMatrix * viewVector );
	intensity = pow( c - dot(vNormal, vNormel), p );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
uniform vec3 glowColor;
varying float intensity;
void main()
{
	vec3 glow = glowColor * intensity;
    gl_FragColor = vec4( glow, 1.0 );
}
`;

const Glow = ({ x, y, z, color, size, status, lastEventId }) => {
  const { camera } = useThree();

  let springConfig = getIntensityInfoForStatus(status);
  const cachedEventId = React.useRef(lastEventId);

  React.useEffect(() => {
    const lastEventIdChanged = lastEventId !== cachedEventId.current;

    if (lastEventIdChanged) {
      const statusShouldReset = status === 'flash' || status === 'fade';

      springConfig.reset = statusShouldReset;

      cachedEventId.current = lastEventId;
    }
  });

  const spring = useSpring(springConfig);

  // const sphereGeometry = new THREE.SphereGeometry(size, 32, 16);
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry attach="geometry" args={[size, 32, 16]} />
      <animated.shaderMaterial
        attach="material"
        args={[
          {
            uniforms: {
              c: { type: 'f', value: 0.2 },
              p: { type: 'f', value: undefined },
              glowColor: { type: 'c', value: new THREE.Color(color) },
              viewVector: { type: 'v3', value: camera.position },
            },
            vertexShader,
            fragmentShader,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
          },
        ]}
        uniforms-glowColor-value={new THREE.Color(color)}
        uniforms-p-value={spring.opacity.interpolate(o =>
          normalize(o, 0, 1, 10, 2)
        )}
      />
    </mesh>
  );
};

export default Glow;
