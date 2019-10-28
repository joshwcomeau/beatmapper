export const DEFAULT_NUM_COLS = 4;
export const DEFAULT_NUM_ROWS = 3;
export const DEFAULT_CELL_SIZE = 1;

export const DEFAULT_GRID = {
  numRows: DEFAULT_NUM_ROWS,
  numCols: DEFAULT_NUM_COLS,
  cellSize: DEFAULT_CELL_SIZE,
};

export const convertLaneIndices = (
  colIndex: number,
  rowIndex: number,
  numCols: number,
  numRows: number,
  cellSize: number = 1
) => {
  // Normally, we have 4 columns and 3 rows.
  // If the user has tweaked that grid, we need to convert to the 4x3 system
  // the game actually uses.
  const deltaCols = numCols - DEFAULT_NUM_COLS;
  const deltaRows = numRows - DEFAULT_NUM_ROWS;

  return [colIndex - deltaCols / 2, rowIndex - deltaRows / 2];
};