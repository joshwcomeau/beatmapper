import React from 'react';

import { LASER_COLORS } from '../../constants';

const AmbientLighting = ({ primaryLightEvent }) => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ambientLight color={LASER_COLORS.red} intensity={0.1} />

      {/* <pointLight color={LASER_COLORS.red} position={[0, 0, -85]} /> */}
    </>
  );
};

export default AmbientLighting;
