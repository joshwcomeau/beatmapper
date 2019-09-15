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
import { BLOCK_COLUMN_WIDTH, SONG_OFFSET } from '../../constants';

import StaticEnvironment from '../StaticEnvironment';
import SongBlocks from '../SongBlocks';
import BarMarkers from '../BarMarkers';
import Obstacles from '../Obstacles';
import PlacementGrid from '../PlacementGrid';
import TrackMover from '../TrackMover';

const MapVisualization = ({ songId }) => {
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
      <StaticEnvironment includeEdgeStrips />

      {/* Fog */}
      <fogExp2 attach="fog" args={[0x000000, 0.02]} />

      <ambientLight intensity={0.45} />

      <TrackMover>
        <SongBlocks />
        <BarMarkers />
        <Obstacles />
      </TrackMover>

      <PlacementGrid
        width={BLOCK_COLUMN_WIDTH * 4}
        height={BLOCK_COLUMN_WIDTH * 3}
        position={[0, 0, -SONG_OFFSET]}
      />
    </>
  );
};

export default MapVisualization;
