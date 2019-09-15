/**
 * This component holds all of the internal 3D stuff, everything
 * you see in the main part of the map editor.
 *
 * It does NOT include the 2D stuff like the toolbar or the track
 * controls.
 */
import React from 'react';
import { useRender } from 'react-three-fiber';

import Controls from '../../controls';

import SideLaser from './SideLaser';
import StaticEnvironment from '../StaticEnvironment';

const LightingPreview = ({ songId }) => {
  const controls = React.useRef(null);

  // Controls to move around the space.
  useRender(({ canvas, scene, camera }) => {
    if (!controls.current) {
      controls.current = new Controls(camera);
      scene.add(controls.current.getObject());
    } else {
      controls.current.update();
    }
  });

  return (
    <>
      <StaticEnvironment />

      <fogExp2 attach="fog" args={[0x000000, 0.0055]} />

      <SideLaser side="left" />
      <SideLaser side="right" />
    </>
  );
};

export default LightingPreview;
