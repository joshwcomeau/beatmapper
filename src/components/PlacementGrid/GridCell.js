import React from 'react';
import * as THREE from 'three';

import { BLOCK_PLACEMENT_SQUARE_SIZE } from '../../constants';
import { convertGridColumn, convertGridRow } from '../../helpers/grid.helpers';
import { createObstacleFromMouseEvent } from '../../helpers/obstacles.helpers';

const CELL_PADDING = 0.05;

const GridSquare = ({
  rowIndex,
  colIndex,
  numRows,
  numCols,
  rowHeight,
  colWidth,
  isHovered,
  gridPosition,
  mouseDownAt,
  setMouseDownAt,
  setMouseOverAt,
  mappingMode,
  defaultObstacleDuration,
  selectionMode,
  selectedTool,
  setHoveredCell,
  clickPlacementGrid,
  createNewObstacle,
}) => {
  // Our `rowHeight` is in units compared to the default, so a
  // non-map-extension grid would have a height and width of 1.
  // A rowHeight of 2 means it's 2x as big as that default.
  // `renderRowHeight` is how tall our grid cell should be in terms of
  // rendering height.
  const renderRowHeight = rowHeight * BLOCK_PLACEMENT_SQUARE_SIZE;
  const renderColWidth = colWidth * BLOCK_PLACEMENT_SQUARE_SIZE;

  // Because we want grids to be centered, the wider the grid, the more
  // each position is pushed further from this position.
  // After sketching out the math, the formula looks like:
  //
  // x = -0.5T + 0.5 + I       // T = Total Columns
  //                           // I = Column Index
  //
  const x = (numCols * -0.5 + 0.5 + colIndex) * renderColWidth;

  const VERTICAL_OFFSET = -BLOCK_PLACEMENT_SQUARE_SIZE;
  const y = rowIndex * renderRowHeight + VERTICAL_OFFSET;

  return (
    <mesh
      key={`${rowIndex}-${colIndex}`}
      position={[gridPosition[0] + x, gridPosition[1] + y, gridPosition[2]]}
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

        // With mapping extensions enabled, it's possible we need to
        // convert the rowIndex/colIndex to one appropriate for the
        // current grid!
        const effectiveColIndex = convertGridColumn(
          colIndex,
          numCols,
          colWidth
        );
        const effectiveRowIndex = convertGridRow(rowIndex, numRows, rowHeight);

        clickPlacementGrid(effectiveRowIndex, effectiveColIndex);
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
        if (selectedTool === 'obstacle' && ev.button === 0 && mouseDownAt) {
          ev.stopPropagation();

          const mouseOverAt = { rowIndex, colIndex };

          const obstacle = createObstacleFromMouseEvent(
            mappingMode,
            numCols,
            numRows,
            colWidth,
            rowHeight,
            mouseDownAt,
            mouseOverAt,
            defaultObstacleDuration
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
        args={[
          renderColWidth - CELL_PADDING,
          renderRowHeight - CELL_PADDING,
          1,
          1,
        ]}
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
};

export default React.memo(GridSquare);
