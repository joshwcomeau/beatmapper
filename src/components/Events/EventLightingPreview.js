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
import { getGraphicsLevel } from '../../reducers/user.reducer';
import { getIsPlaying } from '../../reducers/navigation.reducer';
import { getShowLightingPreview } from '../../reducers/editor.reducer';

import StaticEnvironment from '../StaticEnvironment';
import ReduxForwardingCanvas from '../ReduxForwardingCanvas';

import SideLaser from '../Preview/SideLaser';
import BackLaser from '../Preview/BackLaser';
import SmallRings from '../Preview/SmallRings';
import LargeRings from '../Preview/LargeRings';
import PrimaryLight from '../Preview/PrimaryLight';
import AmbientLighting from '../Preview/AmbientLighting';

const EventLightingPreviewPresentational = ({
  song,
  isPlaying,
  graphicsLevel,
}) => {
  const controls = React.useRef(null);

  // Controls to move around the space.
  useRender(({ canvas, scene, camera }) => {
    if (!controls.current) {
      controls.current = new Controls(camera, [0, -1, 0]);
      scene.add(controls.current.getObject());
    } else {
      controls.current.update();
    }
  });

  const lights = (
    <>
      <SideLaser song={song} isPlaying={isPlaying} side="left" />
      <SideLaser song={song} isPlaying={isPlaying} side="right" />
      <BackLaser song={song} isPlaying={isPlaying} />
      <LargeRings song={song} isPlaying={isPlaying} />
      <SmallRings song={song} isPlaying={isPlaying} />
      <PrimaryLight song={song} isPlaying={isPlaying} />
    </>
  );

  const environment = (
    <>
      <StaticEnvironment />
      <AmbientLighting includeSpotlight />
    </>
  );

  return (
    <>
      {lights}
      {environment}
    </>
  );
};

const EventLightingPreview = ({
  song,
  isPlaying,
  graphicsLevel,
  showLightingPreview,
}) => {
  if (!showLightingPreview) {
    return null;
  }

  return (
    <ReduxForwardingCanvas>
      <EventLightingPreviewPresentational
        song={song}
        isPlaying={isPlaying}
        graphicsLevel={graphicsLevel}
      />
    </ReduxForwardingCanvas>
  );
};

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
    isPlaying: getIsPlaying(state),
    graphicsLevel: getGraphicsLevel(state),
    showLightingPreview: getShowLightingPreview(state),
  };
};

export default connect(mapStateToProps)(EventLightingPreview);
