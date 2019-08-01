import {
  convertMillisecondsToBeats,
  convertBeatsToMilliseconds,
} from './audio.helpers';

describe('Audio helpers', () => {
  describe('converting between audio and beats', () => {
    it('converts 1000ms with convertMillisecondsToBeats', () => {
      const ms = 1000;
      const bpm = 120;

      const actualResult = convertMillisecondsToBeats(ms, bpm);
      const expectedResult = 2;

      expect(actualResult).toEqual(expectedResult);
    });

    it('does not produce 2.999999999 results', () => {
      const ms = 1028.5714285714284;
      const bpm = 175;

      const actualResult = convertMillisecondsToBeats(ms, bpm);
      const expectedResult = 3;

      expect(actualResult).toEqual(expectedResult);
    });

    it('converts 8 beats with convertBeatsToMilliseconds', () => {
      const beats = 8;
      const bpm = 60;

      const actualResult = convertBeatsToMilliseconds(beats, bpm);
      const expectedResult = 8000;

      expect(actualResult).toEqual(expectedResult);
    });
    it('converts in both directions', () => {
      const ms = 250;
      const bpm = 90;

      const actualResult = convertBeatsToMilliseconds(
        convertMillisecondsToBeats(ms, bpm),
        bpm
      );
      const expectedResult = ms;

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
