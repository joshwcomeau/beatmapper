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

import StaticEnvironment from '../StaticEnvironment';
import { Bloom, NoBloom } from '../BloomEffect';
import SideLaser from './SideLaser';
import BackLaser from './BackLaser';
import SmallRings from './SmallRings';
import PrimaryLight from './PrimaryLight';
import AmbientLighting from './AmbientLighting';

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
      <Bloom>
        <SideLaser side="left" />
        <SideLaser side="right" />

        <BackLaser />

        <SmallRings />

        <PrimaryLight />
      </Bloom>

      <NoBloom>
        <>
          <StaticEnvironment />
          <AmbientLighting />
        </>
      </NoBloom>
    </>
  );
};

export default LightingPreview;
