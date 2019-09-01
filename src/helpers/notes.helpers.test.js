import { calculateNoteDensity } from './notes.helpers';

describe('Notes helpers', () => {
  describe('calculateNoteDensity', () => {
    it('gets note density for a simple case', () => {
      const numOfNotes = 10;
      const segmentLengthInBeats = 10;
      const bpm = 60;

      const actualResult = calculateNoteDensity(
        numOfNotes,
        segmentLengthInBeats,
        bpm
      );
      const expectedResult = 1;

      expect(actualResult).toEqual(expectedResult);
    });

    it('gets note density for a slightly less simple case', () => {
      const numOfNotes = 6;
      const segmentLengthInBeats = 12;
      const bpm = 100;

      const actualResult = calculateNoteDensity(
        numOfNotes,
        segmentLengthInBeats,
        bpm
      );
      const expectedResult = 0.3;

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles 0 notes', () => {
      const numOfNotes = 0;
      const segmentLengthInBeats = 12;
      const bpm = 100;

      const actualResult = calculateNoteDensity(
        numOfNotes,
        segmentLengthInBeats,
        bpm
      );
      const expectedResult = 0;

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
