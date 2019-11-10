import { convertGridIndicesToNaturalGrid } from './grid.helpers';

const DEFAULT_NUM_COLS = 4;
const DEFAULT_NUM_ROWS = 3;
const DEFAULT_COL_WIDTH = 1;
const DEFAULT_ROW_HEIGHT = 1;

describe('Grid helpers', () => {
  describe('convertGridRow', () => {
    it('converts the first row in a 4x4 grid (1 extra row)', () => {
      const position = [1, 0];
      const numCols = DEFAULT_NUM_COLS;
      const numRows = 4;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [1, 0];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts the fourth row in a 4x4 grid (1 extra row)', () => {
      const position = [1, 3];
      const numCols = DEFAULT_NUM_COLS;
      const numRows = 4;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [1, 3];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('Handles a row which is half-height', () => {
      const position = [1, 2];
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const rowHeight = 0.5;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        rowHeight
      );
      const expectedPosition = [1, 1];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('Handles a row which is half-height + more rows', () => {
      const position = [1, 5];
      const numCols = DEFAULT_NUM_COLS;
      const numRows = 6;
      const rowHeight = 0.25;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        rowHeight
      );
      const expectedPosition = [1, 1.25];

      expect(actualPosition).toEqual(expectedPosition);
    });
  });
  describe('convertGridIndicesToNaturalGrid', () => {
    it('has no effect on a 4x3 grid', () => {
      const position = [1, 2];
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [1, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 5x3 grid (1 extra col)', () => {
      const position = [1, 2];
      const numCols = 5;
      const numRows = DEFAULT_NUM_ROWS;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [0.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts an 8x3 grid (2 extra cols on each side)', () => {
      const position = [0, 2];
      const numCols = 8;
      const numRows = DEFAULT_NUM_ROWS;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [-2, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 3x3 grid (less cols)', () => {
      const position = [1, 2];
      const numCols = 3;
      const numRows = DEFAULT_NUM_ROWS;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        DEFAULT_COL_WIDTH,
        position[1],
        numRows,
        DEFAULT_ROW_HEIGHT
      );
      const expectedPosition = [1.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('handles a 4x3 grid with half-width columns', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = 0.5;
      const rowHeight = DEFAULT_ROW_HEIGHT;

      const actualPosition = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        rowHeight
      );
      const expectedPosition = [0.75, 0];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('calculates the 2,0 cell in a half-column-width grid', () => {
      const colIndex = 2;
      const rowIndex = 0;
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = 0.5;
      const rowHeight = DEFAULT_ROW_HEIGHT;

      const actualPosition = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        rowHeight
      );
      const expectedPosition = [1.75, 0];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('calculates the -1,1 cell in a half-size grid', () => {
      const colIndex = -1;
      const rowIndex = 1;
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = 0.5;
      const rowHeight = 0.5;

      const actualPosition = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        rowHeight
      );
      const expectedPosition = [0.25, 0.5];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('calculates the 0,0 cell in an oversized 4x-width grid', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = 4;
      const rowHeight = DEFAULT_ROW_HEIGHT;

      const actualPosition = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        rowHeight
      );
      const expectedPosition = [-4.5, 0];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('calculates the 0,0 cell in a half-column width 5x3 grid', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const numCols = 5;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = 0.5;
      const rowHeight = DEFAULT_ROW_HEIGHT;

      const actualPosition = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        rowHeight
      );
      const expectedPosition = [0.5, 0];

      expect(actualPosition).toEqual(expectedPosition);
    });
    it('always produces an identical value for the middle column', () => {
      const colIndex = 2;
      const rowIndex = 0;
      const numCols = 5;
      const numRows = DEFAULT_NUM_ROWS;
      const rowHeight = DEFAULT_ROW_HEIGHT;

      const [narrowX] = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        0.5,
        rowIndex,
        numRows,
        rowHeight
      );

      const [wideX] = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        2.5,
        rowIndex,
        numRows,
        rowHeight
      );

      expect(narrowX).toEqual(wideX);
    });
    it('always produces an identical value for the bottom row', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const numCols = DEFAULT_NUM_COLS;
      const numRows = DEFAULT_NUM_ROWS;
      const colWidth = DEFAULT_COL_WIDTH;

      const [, narrowY] = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        0.5
      );

      const [, wideY] = convertGridIndicesToNaturalGrid(
        colIndex,
        numCols,
        colWidth,
        rowIndex,
        numRows,
        3
      );

      expect(narrowY).toEqual(wideY);
    });
  });
});
