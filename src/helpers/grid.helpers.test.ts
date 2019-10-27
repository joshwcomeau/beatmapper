import { convertLaneIndices } from './grid.helpers';

describe('Grid helpers', () => {
  describe('convertLaneIndices', () => {
    it('has no effect on a 4x3 grid', () => {
      const position = [1, 2];
      const numCols = 4;
      const numRows = 3;

      const actualPosition = convertLaneIndices(
        position[0],
        position[1],
        numCols,
        numRows
      );
      const expectedPosition = [1, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 5x3 grid (1 extra col)', () => {
      const position = [1, 2];
      const numCols = 5;
      const numRows = 3;

      const actualPosition = convertLaneIndices(
        position[0],
        position[1],
        numCols,
        numRows
      );
      const expectedPosition = [0.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 6x4 grid (larger in both axes)', () => {
      const position = [1, 2];
      const numCols = 6;
      const numRows = 4;

      const actualPosition = convertLaneIndices(
        position[0],
        position[1],
        numCols,
        numRows
      );
      const expectedPosition = [0, 1.5];

      expect(actualPosition).toEqual(expectedPosition);
    });

    it('converts a 3x3 grid (less cols)', () => {
      const position = [1, 2];
      const numCols = 3;
      const numRows = 3;

      const actualPosition = convertLaneIndices(
        position[0],
        position[1],
        numCols,
        numRows
      );
      const expectedPosition = [1.5, 2];

      expect(actualPosition).toEqual(expectedPosition);
    });
  });
});
