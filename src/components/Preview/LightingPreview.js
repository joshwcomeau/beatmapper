/**
 * This component holds all of the internal 3D stuff, everything
 * you see in the main part of the map editor.
 *
 * It does NOT include the 2D stuff like the toolbar or the track
 * controls.
 */
import React from 'react';
import { useRender } from 'react-three-fiber';
import { connect } from 'react-redux';

import Controls from '../../controls';
import { getSelectedSong } from '../../reducers/songs.reducer';

import StaticEnvironment from '../StaticEnvironment';
import { Bloom, NoBloom } from '../BloomEffect';
import Fog from '../Fog';
import SideLaser from './SideLaser';
import BackLaser from './BackLaser';
import SmallRings from './SmallRings';
import LargeRings from './LargeRings';
import PrimaryLight from './PrimaryLight';
import AmbientLighting from './AmbientLighting';

const LightingPreview = ({ song }) => {
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
        <SideLaser song={song} side="left" />
        <SideLaser song={song} side="right" />
        <BackLaser song={song} />
        <LargeRings />
        <SmallRings />
        <PrimaryLight song={song} />
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

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
  };
};

export default connect(mapStateToProps)(LightingPreview);
