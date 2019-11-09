import React from 'react';
import * as THREE from 'three';

import {
  BLOCK_COLUMN_WIDTH,
  BLOCK_PLACEMENT_SQUARE_SIZE,
  SONG_OFFSET,
  BLOCK_SIZE,
} from '../../constants';
import { Obstacle } from '../../types';
import oswaldGlyphs from '../../assets/fonts/oswald.json';

import {
  getPositionForObstacle,
  getPositionForObstacleNew,
  getDimensionsForObstacle,
} from './ObstacleBox.helpers';

interface Props {
  obstacle: Obstacle;
  color: string;
  snapTo: number;
  beatDepth: number;
  gridRows: number;
  gridCols: number;
  gridRowHeight: number;
  gridColWidth: number;
  handleDelete: (id: string) => void;
  handleResize: (id: string, newBeatDuration: number) => void;
  handleClick: (id: string) => void;
  handleMouseOver: (ev: any) => void;
}

const RESIZE_THRESHOLD = 30;

// in Threejs, objects are always positioned relative to their center.
// This is tricky when it comes to obstacles, which come in a range of sizes
// and shapes; it would be much easier to orient them based on their top/left
// position. This function works that all out.
const adjustPositionForObstacle = (
  type: 'wall' | 'ceiling' | 'extension',
  humanizedPosition: [number, number, number],
  width: number,
  height: number,
  depth: number
) => {
  // For our `x`, if our obstacle's `width` was only 1, we could shift it by
  // 0.5 BLOCK_COLUMN_WIDTH. If our width is 2, we'd need to shift right by 1.
  // 3, and it would be shifted by 1.5
  const x = humanizedPosition[0] + width / 2;

  let y = humanizedPosition[1];
  if (type === 'wall' || type === 'ceiling') {
    y = humanizedPosition[1] - height / 2;
  } else {
    // HACK: Not sure why the extra BLOCK_COLUMN_WIDTH half-step is required :/
    // Without it, positions are off by half a cell.
    y = humanizedPosition[1] + height / 2;
  }

  const z = humanizedPosition[2] - depth / 2 + 0.1;

  return [x, y, z];
};

const ObstacleBox: React.FC<Props> = ({
  obstacle,
  color,
  beatDepth,
  snapTo,
  gridRows,
  gridCols,
  gridRowHeight,
  gridColWidth,
  handleDelete,
  handleResize,
  handleClick,
  handleMouseOver,
}) => {
  const obstacleDimensions = getDimensionsForObstacle(obstacle, beatDepth);

  const mesh = React.useMemo(() => {
    const geometry = new THREE.BoxGeometry(
      obstacleDimensions.width,
      obstacleDimensions.height,
      obstacleDimensions.depth
    );
    const material = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: obstacle.tentative ? 0.15 : 0.4,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
      emissive: 'yellow',
      emissiveIntensity: obstacle.selected ? 0.5 : 0,
    });

    return new THREE.Mesh(geometry, material);
  }, [
    obstacleDimensions.depth,
    obstacleDimensions.height,
    obstacle.tentative,
    obstacleDimensions.width,
    obstacle.selected,
  ]);

  const actualPosition = getPositionForObstacleNew(
    obstacle,
    obstacleDimensions,
    beatDepth
  );

  const [mouseDownAt, setMouseDownAt] = React.useState(false);

  React.useEffect(() => {
    const handlePointerMove = (ev: any) => {
      if (!mouseDownAt) {
        return;
      }

      // @ts-ignore
      const delta = ev.pageX - mouseDownAt;
      if (Math.abs(delta) > RESIZE_THRESHOLD) {
        // Check how many "steps" away this is from the mouse-down position
        let numOfSteps = Math.floor(delta / RESIZE_THRESHOLD);

        // If this number is different from our current value, dispatch a
        // resize event
        let newBeatDuration = obstacle.beatDuration + snapTo * numOfSteps;

        // Ignore negative beat durations
        newBeatDuration = Math.max(0, newBeatDuration);

        if (newBeatDuration !== obstacle.beatDuration) {
          handleResize(obstacle.id, newBeatDuration);
        }
      }
    };

    const handlePointerUp = () => {
      if (mouseDownAt) {
        // @ts-ignore
        setMouseDownAt(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseDownAt, handleResize]);

  const font = new THREE.Font(oswaldGlyphs);
  const textGeometryOptions = {
    font,
    size: 0.4,
    height: 0.025,
    curveSegments: 2,
  };

  return (
    <>
      {obstacle.fast && (
        <mesh position={actualPosition}>
          <textGeometry attach="geometry" args={['F', textGeometryOptions]} />
          <meshLambertMaterial attach="material" color="#AAA" />
        </mesh>
      )}

      {/* @ts-ignore */}
      <primitive
        object={mesh}
        position={actualPosition}
        onPointerUp={(ev: any) => {
          if (obstacle.tentative) {
            return;
          }

          // Impossible condition, I believe
          if (typeof mouseDownAt !== 'number') {
            return;
          }

          // if the user is resizing the box, we don't want to also select it.
          // They should be two distinct operations.
          const distance = Math.abs(ev.pageX - mouseDownAt);
          if (distance > RESIZE_THRESHOLD) {
            return;
          }

          ev.stopPropagation();

          handleClick(obstacle.id);
        }}
        onPointerDown={(ev: any) => {
          ev.stopPropagation();

          if (ev.buttons === 2) {
            handleDelete(obstacle.id);
          } else {
            setMouseDownAt(ev.pageX);
          }
        }}
        onPointerOver={handleMouseOver}
      />
    </>
  );
};

export default ObstacleBox;
