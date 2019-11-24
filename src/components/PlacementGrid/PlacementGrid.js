import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { BLOCK_PLACEMENT_SQUARE_SIZE } from '../../constants';
import { range } from '../../utils';
import { convertGridColumn, convertGridRow } from '../../helpers/grid.helpers';
import { getColorForItem } from '../../helpers/colors.helpers';
import {
  getGridSize,
  getMappingMode,
  getSelectedSong,
} from '../../reducers/songs.reducer';

import { getDirectionForDrag } from './PlacementGrid.helpers';
import TentativeObstacle from './TentativeObstacle';
import TentativeBlock from './TentativeBlock';
import GridCell from './GridCell';
import { getDefaultObstacleDuration } from '../../reducers/editor.reducer';

const PlacementGrid = ({
  width,
  gridPosition,
  song,
  selectedTool,
  selectionMode,
  mappingMode,
  defaultObstacleDuration,
  numRows,
  numCols,
  colWidth,
  rowHeight,
  clickPlacementGrid,
  setBlockByDragging,
  createNewObstacle,
  clearCellOfNotes,
}) => {
  const renderColWidth = colWidth * BLOCK_PLACEMENT_SQUARE_SIZE;
  const renderRowHeight = rowHeight * BLOCK_PLACEMENT_SQUARE_SIZE;

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

  const [tentativeBlock, setTentativeBlock] = React.useState(null);

  React.useEffect(() => {
    // HACK HACK HACK:
    // I'm having closure issues, so in addition to the `tentativeBlock`
    // in state that is rendered for the user, I'm duplicating that data
    // within this effect under `evenMoreTentativeBlock`. This is hacky
    // and a bad idea, but it works and I'm lazy.
    let evenMoreTentativeBlock;

    const handleMouseMove = ev => {
      const { rowIndex, colIndex, ...initialPosition } = mouseDownAt;

      if (selectedTool !== 'left-block' && selectedTool !== 'right-block') {
        return;
      }

      const currentPosition = {
        x: ev.pageX,
        y: ev.pageY,
      };

      const direction = getDirectionForDrag(
        initialPosition,
        currentPosition,
        mappingMode,
        ev.metaKey
      );

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

        const effectiveColIndex = convertGridColumn(
          colIndex,
          numCols,
          colWidth
        );
        const effectiveRowIndex = convertGridRow(rowIndex, numRows, rowHeight);

        // If this is the first move event that creates this tentative block,
        // delete any pre-existing block in this cell
        clearCellOfNotes(effectiveRowIndex, effectiveColIndex);

        evenMoreTentativeBlock = {
          direction,
          rowIndex: effectiveRowIndex,
          colIndex: effectiveColIndex,
          selectedTool,
        };

        setTentativeBlock(evenMoreTentativeBlock);

        cachedDirection.current = direction;
      }
    };

    const handleMouseUp = ev => {
      window.requestAnimationFrame(() => {
        if (evenMoreTentativeBlock) {
          setBlockByDragging(
            evenMoreTentativeBlock.direction,
            evenMoreTentativeBlock.rowIndex,
            evenMoreTentativeBlock.colIndex,
            evenMoreTentativeBlock.selectedTool
          );
          setTentativeBlock(null);
        }
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
      {range(numRows).map(rowIndex =>
        range(numCols).map(colIndex => {
          const isHovered = !!(
            hoveredCell &&
            hoveredCell.rowIndex === rowIndex &&
            hoveredCell.colIndex === colIndex
          );

          return (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              numRows={numRows}
              numCols={numCols}
              rowHeight={rowHeight}
              colWidth={colWidth}
              renderRowHeight={renderRowHeight}
              renderColWidth={renderColWidth}
              isHovered={isHovered}
              gridPosition={gridPosition}
              selectedTool={selectedTool}
              mouseDownAt={mouseDownAt}
              setMouseDownAt={setMouseDownAt}
              setMouseOverAt={setMouseOverAt}
              mappingMode={mappingMode}
              defaultObstacleDuration={defaultObstacleDuration}
              selectionMode={selectionMode}
              setHoveredCell={setHoveredCell}
              clickPlacementGrid={clickPlacementGrid}
              createNewObstacle={createNewObstacle}
            />
          );
        })
      )}

      {tentativeBlock && (
        <TentativeBlock
          song={song}
          direction={tentativeBlock.direction}
          rowIndex={tentativeBlock.rowIndex}
          colIndex={tentativeBlock.colIndex}
          color={getColorForItem(tentativeBlock.selectedTool, song)}
        />
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
    selectedTool: state.editor.notes.selectedTool,
    selectionMode: state.editor.notes.selectionMode,
    mappingMode: getMappingMode(state),
    defaultObstacleDuration: getDefaultObstacleDuration(state),
    numRows: gridSize.numRows,
    numCols: gridSize.numCols,
    colWidth: gridSize.colWidth,
    rowHeight: gridSize.rowHeight,
  };
};

export default connect(
  mapStateToProps,
  {
    clickPlacementGrid: actions.clickPlacementGrid,
    setBlockByDragging: actions.setBlockByDragging,
    createNewObstacle: actions.createNewObstacle,
    clearCellOfNotes: actions.clearCellOfNotes,
  }
)(PlacementGrid);
