import React from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';

import * as actions from '../../actions';
import { range } from '../../utils';
import { getCursorPositionInBeats } from '../../reducers/navigation.reducer';

import { getDirectionForDrag } from './PlacementGrid.helpers';

import TentativeObstacle from './TentativeObstacle';

const PlacementGrid = ({
  width,
  height,
  position,
  cursorPositionInBeats,
  selectedDirection,
  selectedTool,
  selectionMode,
  clickPlacementGrid,
  setBlockByDragging,
  createNewObstacle,
}) => {
  const NUM_ROWS = 3;
  const NUM_COLS = 4;

  const [mouseDownAt, setMouseDownAt] = React.useState(null);
  const [mouseOverAt, setMouseOverAt] = React.useState(null);
  const cachedDirection = React.useRef(null);

  const [hoveredCell, setHoveredCell] = React.useState(null);

  // React.useEffect(() => {
  //   let timeoutId;

  //   if (!mouseOverAt) {
  //     timeoutId = window.setTimeout(() => {
  //       setHoveredCell(null);
  //     })
  //   } else {
  //     window.clearTimeout(timeoutId)
  //   }

  //   return () => {

  //   }
  // }, [mouseOverAt])

  // TODO: I should rework this using `usePointerUpHandler`.
  // And maybe another one for pointermove?
  React.useEffect(() => {
    const handleMouseMove = ev => {
      const { rowIndex, colIndex, ...initialPosition } = mouseDownAt;

      if (selectedTool !== 'red-block' && selectedTool !== 'blue-block') {
        return;
      }

      const currentPosition = {
        x: ev.pageX,
        y: ev.pageY,
      };

      const direction = getDirectionForDrag(initialPosition, currentPosition);

      if (
        typeof direction === 'number' &&
        direction !== cachedDirection.current
      ) {
        // Mousemoves register very quickly; dozens of identical events might
        // be submitted if we don't stop it, causing a backlog to accumulate
        // on the main thread.
        if (cachedDirection.current === direction) {
          return;
        }

        setBlockByDragging(
          direction,
          rowIndex,
          colIndex,
          cursorPositionInBeats,
          selectedTool
        );

        cachedDirection.current = direction;
      }
    };

    const handleMouseUp = ev => {
      window.requestAnimationFrame(() => {
        setMouseDownAt(null);
        setMouseOverAt(null);
        setHoveredCell(null);
        cachedDirection.current = null;
      });
    };

    if (mouseDownAt) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line
  }, [mouseDownAt, selectedTool]);

  return (
    <>
      {range(NUM_ROWS).map(rowIndex =>
        range(NUM_COLS).map(colIndex => {
          const cellSize = width / 4;
          const paddedCellSize = cellSize - width * 0.01;

          const cellId = `${rowIndex}-${colIndex}`;

          return (
            <mesh
              key={cellId}
              position={[
                position[0] - cellSize * 1.5 + colIndex * cellSize,
                position[1] - cellSize * 1 + rowIndex * cellSize,
                position[2],
              ]}
              onClick={ev => {
                ev.stopPropagation();

                // If we're in the process of selecting/deselecting/deleting
                // notes, and the user happens to finish while over the
                // placement grid, don't create new blocks.
                if (selectionMode) {
                  return;
                }

                // Because this is really one big canvas, `onClick`
                // fires even if the mouse starts somewhere else and
                // releases over a placement grid tile.
                // This causes problems when resizing obstacles.
                if (!mouseDownAt) {
                  return;
                }

                // If we're adding an obstacle, we use the other handlers
                if (selectedTool === 'obstacle') {
                  return;
                }

                // If we clicked down on one grid and up on another, don't
                // count it.
                if (
                  mouseDownAt &&
                  (mouseDownAt.rowIndex !== rowIndex ||
                    mouseDownAt.colIndex !== colIndex)
                ) {
                  return;
                }

                clickPlacementGrid(
                  rowIndex,
                  colIndex,
                  cursorPositionInBeats,
                  selectedDirection,
                  selectedTool
                );
              }}
              onPointerDown={ev => {
                // Only pay attention to left-clicks when it comes to the
                // placement grid. Right-clicks should pass through.
                if (ev.buttons !== 1) {
                  return;
                }

                ev.stopPropagation();

                setMouseDownAt({
                  rowIndex,
                  colIndex,
                  x: ev.pageX,
                  y: ev.pageY,
                });
              }}
              onPointerUp={ev => {
                if (
                  selectedTool === 'obstacle' &&
                  ev.button === 0 &&
                  mouseDownAt
                ) {
                  ev.stopPropagation();

                  createNewObstacle(
                    mouseDownAt,
                    { rowIndex, colIndex },
                    cursorPositionInBeats
                  );
                }
              }}
              onPointerOver={ev => {
                setMouseOverAt({ rowIndex, colIndex });

                if (!mouseDownAt) {
                  setHoveredCell(cellId);
                }
              }}
              onPointerOut={ev => {
                if (!mouseDownAt && hoveredCell === `${rowIndex}-${colIndex}`) {
                  setHoveredCell(null);
                }
              }}
            >
              <planeGeometry
                attach="geometry"
                args={[paddedCellSize, paddedCellSize, 1, 1]}
              />
              <meshBasicMaterial
                attach="material"
                color={0xffffff}
                transparent={true}
                opacity={hoveredCell === cellId ? 0.2 : 0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })
      )}

      <mesh position={[0, -2.5, position[2]]}>
        <planeGeometry
          attach="geometry"
          args={[
            // while each square is roughly 1/4 the total width, I remove
            // a bit of a gutter (not just between squares, but around the
            // perimeter). I need to reduce the width ever-so-slight;y
            width - width * 0.01,
            // The height is an arbitrary magic number which works
            0.45,
            // no need for multiple segments.
            1,
            1,
          ]}
        />
        <meshBasicMaterial
          attach="material"
          color={0xffffff}
          transparent={true}
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {mouseDownAt && selectedTool === 'obstacle' && (
        <TentativeObstacle
          mouseDownAt={mouseDownAt}
          mouseOverAt={mouseOverAt}
          cursorPositionInBeats={cursorPositionInBeats}
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  cursorPositionInBeats: getCursorPositionInBeats(state),
  selectedDirection: state.editor.notes.selectedDirection,
  selectedTool: state.editor.notes.selectedTool,
  selectionMode: state.editor.notes.selectionMode,
});

export default connect(
  mapStateToProps,
  {
    clickPlacementGrid: actions.clickPlacementGrid,
    setBlockByDragging: actions.setBlockByDragging,
    createNewObstacle: actions.createNewObstacle,
  }
)(PlacementGrid);
