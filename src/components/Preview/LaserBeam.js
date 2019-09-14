import React from 'react';
import { useSpring, animated } from 'react-spring/three';

const getIntensityInfoForStatus = status => {
  switch (status) {
    case 'off':
      return {
        to: { intensity: 0 },
        immediate: true,
      };

    case 'on': {
      return {
        to: { intensity: 0.5 },
        immediate: true,
      };
    }

    case 'flash': {
      return {
        from: { intensity: 1 },
        to: { intensity: 0.5 },
        immediate: false,
        reset: true,
      };
    }

    case 'fade': {
      return {
        from: { intensity: 1 },
        to: { intensity: 0 },
        immediate: false,
        reset: true,
      };
    }
  }
};

const LaserBeam = ({ color, position, rotation, brightness, status }) => {
  const radius = 0.35;
  const height = 300;

  let intensitySpringConfig = getIntensityInfoForStatus(status);

  const spring = useSpring(intensitySpringConfig);

  return (
    <group>
      <mesh position={position} rotation={rotation}>
        <cylinderGeometry attach="geometry" args={[radius, radius, height]} />
        <animated.meshLambertMaterial
          attach="material"
          emissive={color}
          emissiveIntensity={spring.intensity.interpolate(i => i)}
        />
      </mesh>
    </group>
  );
};

export default LaserBeam;
