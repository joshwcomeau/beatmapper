import {
  convertGridIndicesToNaturalGrid,
  convertGridIndicesToCustomGrid,
  getCellCoordinates,
} from './grid.helpers';

describe('Grid helpers', () => {
  describe('convertGridIndicesToNaturalGrid', () => {
    it('has no effect on a 4x3 grid', () => {
      const position = [1, 2];
      const numCols = 4;
      const numRows = 3;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        position[1],
        numRows
      );
      const expectedPosition = [1, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 5x3 grid (1 extra col)', () => {
      const position = [1, 2];
      const numCols = 5;
      const numRows = 3;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        position[1],
        numRows
      );
      const expectedPosition = [0.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts an 8x3 grid (2 extra cols on each side)', () => {
      const position = [0, 2];
      const numCols = 8;
      const numRows = 3;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        position[1],
        numRows
      );
      const expectedPosition = [-2, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 6x4 grid (larger in both axes)', () => {
      const position = [1, 2];
      const numCols = 6;
      const numRows = 4;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        position[1],
        numRows
      );
      const expectedPosition = [0, 1.5];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 3x3 grid (less cols)', () => {
      const position = [1, 2];
      const numCols = 3;
      const numRows = 3;

      const actualPosition = convertGridIndicesToNaturalGrid(
        position[0],
        numCols,
        position[1],
        numRows
      );
      const expectedPosition = [1.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('can convert columns exclusively', () => {
      const colIndex = 1;
      const numCols = 3;

      const actualPosition = convertGridIndicesToNaturalGrid(colIndex, numCols);
      const expectedPosition = [1.5];

      expect(actualPosition).toEqual(expectedPosition);
    });
  });

  describe('getCellCoordinates', () => {
    it('calculates the 0,0 cell in a 0.5x1 grid', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const colWidth = 0.5;
      const rowHeight = 1;

      const [x, y] = getCellCoordinates(
        colIndex,
        rowIndex,
        colWidth,
        rowHeight
      );

      expect(y).toEqual(0);
      expect(x).toEqual(0.75);
    });
    it('calculates the 2,0 cell in a 0.5x1 grid', () => {
      const colIndex = 2;
      const rowIndex = 0;
      const colWidth = 0.5;
      const rowHeight = 1;

      const [x, y] = getCellCoordinates(
        colIndex,
        rowIndex,
        colWidth,
        rowHeight
      );

      expect(y).toEqual(0);
      expect(x).toEqual(1.75);
    });
    it('calculates the -1,1 cell in a 0.5x0.5 grid', () => {
      const colIndex = -1;
      const rowIndex = 1;
      const colWidth = 0.5;
      const rowHeight = 0.5;

      const [x, y] = getCellCoordinates(
        colIndex,
        rowIndex,
        colWidth,
        rowHeight
      );

      expect(y).toEqual(1.25);
      expect(x).toEqual(0.25);
    });
    it('calculates the 0,0 cell in a 4x1 grid', () => {
      const colIndex = 0;
      const rowIndex = 0;
      const colWidth = 4;
      const rowHeight = 1;

      const [x, y] = getCellCoordinates(
        colIndex,
        rowIndex,
        colWidth,
        rowHeight
      );

      expect(y).toEqual(0);
      expect(x).toEqual(-4.5);
    });
  });
});
