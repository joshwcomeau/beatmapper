import React from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';

import * as actions from '../../actions';
import { range, roundToNearest } from '../../utils';
import { convertLaneIndices } from '../../helpers/grid.helpers';
import { getColorForItem } from '../../helpers/colors.helpers';
import { createObstacleFromMouseEvent } from '../../helpers/obstacles.helpers';
import {
  getCursorPositionInBeats,
  getSnapTo,
} from '../../reducers/navigation.reducer';
import {
  getGridSize,
  getMappingMode,
  getSelectedSong,
} from '../../reducers/songs.reducer';

import { getDirectionForDrag } from './PlacementGrid.helpers';
import TentativeObstacle from './TentativeObstacle';

const PlacementGrid = ({
  width,
  position,
  song,
  cursorPositionInBeats,
  snapTo,
  selectedDirection,
  selectedTool,
  selectionMode,
  mappingMode,
  numRows,
  numCols,
  cellSize,
  clickPlacementGrid,
  setBlockByDragging,
  createNewObstacle,
}) => {
  const CELL_SIZE_SCALE = 1.5;

  const renderCellSize = cellSize * CELL_SIZE_SCALE;

  const [mouseDownAt, setMouseDownAt] = React.useState(null);
  const [mouseOverAt, setMouseOverAt] = React.useState(null);
  const cachedDirection = React.useRef(null);

  // `hoveredCell` is an indication of which square is currently highlighted
  // by the cursor. You might think I could just use `mouseOverAt`, but
  // there are 2 reasons why I can't:
  // - When clicking and dragging to place a cell, I want to 'lock'
  //   hoveredCell, even though I'm still mousing over other cells
  // - A weird bug (maybe?) means that mouseOver events can fire BEFORE
  //   mouseOut events (on the cell being leaved). So I get buggy flickering
  //   if I don't use this derived value.
  const [hoveredCell, setHoveredCell] = React.useState(null);

  React.useEffect(() => {
    const handleMouseMove = ev => {
      const { rowIndex, colIndex, ...initialPosition } = mouseDownAt;

      if (selectedTool !== 'left-block' && selectedTool !== 'right-block') {
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

        const [effectiveColIndex, effectiveRowIndex] = convertLaneIndices(
          colIndex,
          rowIndex,
          numCols,
          numRows
        );

        setBlockByDragging(
          direction,
          effectiveRowIndex,
          effectiveColIndex,
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

  const paddedCellSize = renderCellSize - 0.05;

  return (
    <>
      {range(numRows).map(rowIndex =>
        range(numCols).map(colIndex => {
          // All cell squares are cellSize apart.
          // Because we want grids to be centered, the wider the grid, the more
          // each position is pushed further from this position.
          // After sketching out the math, the formula looks like:
          //
          // x = -0.5T + 0.5 + I       // T = Total Columns
          //                           // I = Column Index
          //
          const x = (numCols * -0.5 + 0.5 + colIndex) * renderCellSize;
          const y = (numRows * -0.5 + 0.5 + rowIndex) * renderCellSize;

          const isHovered =
            hoveredCell &&
            hoveredCell.rowIndex === rowIndex &&
            hoveredCell.colIndex === colIndex;

          return (
            <mesh
              key={`${rowIndex}-${colIndex}`}
              position={[position[0] + x, position[1] + y, position[2]]}
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

                // If the user tries to place blocks while the song is playing,
                // we want to snap to the nearest snapping interval.
                // eg. if they're set to snap to 1/2 beats, and they click
                // when the song is 3.476 beats in, we should round up to 3.5.
                const roundedCursorPositionInBeats = roundToNearest(
                  cursorPositionInBeats,
                  snapTo
                );

                // With mapping extensions enabled, it's possible we need to
                // convert the rowIndex/colIndex to one appropriate for the
                // current grid!
                const [
                  effectiveColIndex,
                  effectiveRowIndex,
                ] = convertLaneIndices(colIndex, rowIndex, numCols, numRows);

                clickPlacementGrid(
                  effectiveRowIndex,
                  effectiveColIndex,
                  roundedCursorPositionInBeats,
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

                // If the user is placing an obstacle, the idea of a hovered
                // cell suddenly doesn't make as much sense.
                if (selectedTool === 'obstacle' && isHovered) {
                  setHoveredCell(null);
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

                  const mouseOverAt = { rowIndex, colIndex };

                  const obstacle = createObstacleFromMouseEvent(
                    mappingMode,
                    mouseDownAt,
                    mouseOverAt,
                    cursorPositionInBeats
                  );

                  createNewObstacle(obstacle);
                }
              }}
              onPointerOver={ev => {
                setMouseOverAt({ rowIndex, colIndex });

                // Don't update 'hoveredCell' if I'm clicking and dragging
                // a block
                if (!mouseDownAt) {
                  setHoveredCell({ rowIndex, colIndex });
                }
              }}
              onPointerOut={ev => {
                // If the user is in the middle of placing a block, ignore
                // this event
                if (mouseDownAt) {
                  return;
                }

                // A strange quirk/bug can mean that the `pointerOut` event
                // fires AFTER the user has already entered a new cell.
                // Only unset the hovered cell if they haven't already
                // moved onto a new cell.
                if (isHovered) {
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
                opacity={isHovered ? 0.2 : 0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })
      )}

      {mouseDownAt && selectedTool === 'obstacle' && (
        <TentativeObstacle
          mouseDownAt={mouseDownAt}
          mouseOverAt={mouseOverAt}
          color={getColorForItem('obstacle', song)}
          mode={mappingMode}
        />
      )}
    </>
  );
};

const mapStateToProps = state => {
  const song = getSelectedSong(state);
  const gridSize = getGridSize(state);

  return {
    song,
    cursorPositionInBeats: getCursorPositionInBeats(state),
    snapTo: getSnapTo(state),
    selectedDirection: state.editor.notes.selectedDirection,
    selectedTool: state.editor.notes.selectedTool,
    selectionMode: state.editor.notes.selectionMode,
    mappingMode: getMappingMode(state),
    numRows: gridSize.numRows,
    numCols: gridSize.numCols,
    cellSize: gridSize.cellSize,
  };
};

export default connect(
  mapStateToProps,
  {
    clickPlacementGrid: actions.clickPlacementGrid,
    setBlockByDragging: actions.setBlockByDragging,
    createNewObstacle: actions.createNewObstacle,
  }
)(PlacementGrid);
