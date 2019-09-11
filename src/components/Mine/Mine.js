/**
 * Mines are an anti-block; you don't want to hit them with your saber.
 *
 * NOTE: This code is largely duplicated with Block.js. There's probably a
 * smart abstraction, but for now the duplication doesn't bug me much.
 */
import React from 'react';

import mineUrl from '../../assets/obj/mine.obj';
import useObject from '../../hooks/use-object.hook';

const Mine = React.memo(
  ({
    x,
    y,
    z,
    time,
    lineLayer,
    lineIndex,
    direction,
    color,
    size = 1,
    isTransparent,
    isSelected,
    handleClick,
    handleStartSelecting,
    handleMouseOver,
  }) => {
    const position = [x, y, z];

    const scaleFactor = size * 0.5;

    const group = useObject(mineUrl);

    if (!group) {
      return null;
    }

    const geometry = group.children[0].geometry;

    return (
      <group>
        <mesh
          castShadow
          position={position}
          scale={[scaleFactor, scaleFactor, scaleFactor]}
          onClick={ev => {
            ev.stopPropagation();
          }}
          onPointerDown={ev => {
            ev.stopPropagation();

            // Start selecting! If this block is already selected, it'll
            // start deselecting instead
            let selectionMode;
            if (ev.button === 0) {
              selectionMode = isSelected ? 'deselect' : 'select';
            } else if (ev.button === 1) {
              // Middle clicks shouldnt affect selections
              selectionMode = null;
            } else if (ev.button === 2) {
              selectionMode = 'delete';
            }
            handleStartSelecting(selectionMode);

            const clickType = ev.button === 2 ? 'right' : 'left';

            handleClick(clickType, time, lineLayer, lineIndex);
          }}
          onPointerOver={ev => {
            ev.stopPropagation();

            handleMouseOver(time, lineLayer, lineIndex);
          }}
        >
          <primitive object={geometry} attach="geometry" />
          <meshStandardMaterial
            attach="material"
            metalness={0.75}
            roughness={0.4}
            color={color}
            transparent={isTransparent}
            emissive={'yellow'}
            emissiveIntensity={isSelected ? 0.5 : 0}
            opacity={isTransparent ? 0.25 : 1}
          />
        </mesh>
      </group>
    );
  }
);

export default Mine;
