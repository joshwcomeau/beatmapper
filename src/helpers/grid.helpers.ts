export const DEFAULT_NUM_COLS = 4;
export const DEFAULT_NUM_ROWS = 3;
export const DEFAULT_COL_WIDTH = 1;
export const DEFAULT_ROW_HEIGHT = 1;

export const DEFAULT_GRID = {
  numRows: DEFAULT_NUM_ROWS,
  numCols: DEFAULT_NUM_COLS,
  colWidth: DEFAULT_COL_WIDTH,
  rowHeight: DEFAULT_ROW_HEIGHT,
};

export const convertGridColumn = (
  colIndex: number,
  numCols: number,
  colWidth: number
) => {
  // Getting the index is according to this formula.
  const index = colIndex - (numCols - DEFAULT_NUM_COLS) / 2;

  // Normally, each cell is 1x1 width x height.
  // If our columns are 0.5 width, the ratio is 0.5.
  // First we need to find out what that means for the offset of the 0 cell.
  // The formula for that is y = ax + b, where
  // - `y` is the new offset
  // - `x` is the ratio.
  // - `a` is the amount to multiply our ratio by, works out to either -1.5
  //   or -1 depending on desired Total
  // - `b` is the y intercept at 0, which for some reason is -a -shrugs-

  let a = (DEFAULT_NUM_COLS - 1) / -2;
  let b = a * -1;

  const offset = a * colWidth + b;

  // our formula to find the new x or y position, then, is:
  // y = colWidth * index + offset

  const newValue = colWidth * index + offset;

  return newValue;
};

export const convertGridRow = (
  rowIndex: number,
  // NOTE: `numRows` is unused and should be removed
  numRows: number,
  rowHeight: number
) => {
  return rowIndex * rowHeight;
};

/**
 * With Mapping Extensions, we need to move between two different grid systems:
 * - The normal game system, which has columns from 0-3, rows from 0-2
 * - Our custom grid, which can have any number of columns or rows.
 *
 * For example, in an 8x3 grid (2 extra columns on each side), the top-left
 * corner would have a position of [0,2] in our custom grid, but that
 * translates to a position of [-2,2] in our natural game grid.
 *
 * This function converts from our custom grid [0,2] to a standard grid [-2,2]
 */
export const convertGridIndicesToNaturalGrid = (
  colIndex: number,
  numCols: number,
  colWidth: number,
  rowIndex: number,
  numRows: number,
  rowHeight: number
) => {
  return [
    convertGridColumn(colIndex, numCols, colWidth),
    convertGridRow(rowIndex, numRows, rowHeight),
  ];
};
