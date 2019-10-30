import {
  calculateNoteDensity,
  convertBlocksToRedux,
  convertBlocksToExportableJson,
  convertNotesToMappingExtensions,
  convertNotesFromMappingExtensions,
} from './notes.helpers';

describe('Notes helpers', () => {
  describe('convertBlocksToRedux', () => {
    it('converts', () => {
      const blocks = [
        {
          _time: 2,
          _lineIndex: 2,
          _lineLayer: 0,
          _type: 0,
          _cutDirection: 1,
        },
        {
          _time: 3.5,
          _lineIndex: 3,
          _lineLayer: 0,
          _type: 1,
          _cutDirection: 0,
        },
      ];

      const actualResult = convertBlocksToRedux(blocks);

      const expectedResult = [
        {
          id: actualResult[0].id, // Randomly generated so I have to cheat
          color: 'blue',
          direction: 'down',
          beatNum: 2,
          rowIndex: 0,
          colIndex: 2,
        },
        {
          id: actualResult[1].id,
          color: 'red',
          direction: 'up',
          beatNum: 3.5,
          rowIndex: 0,
          colIndex: 3,
        },
      ];
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('convertBlocksToExportableJson', () => {
    it('converts', () => {
      const blocks = [
        {
          id: 'a',
          color: 'blue',
          direction: 'down',
          beatNum: 2,
          rowIndex: 0,
          colIndex: 2,
        },
        {
          id: 'b',
          color: 'red',
          direction: 'up',
          beatNum: 3.5,
          rowIndex: 0,
          colIndex: 3,
        },
      ];

      const actualResult = convertBlocksToExportableJson(blocks);

      const expectedResult = [
        {
          _time: 2,
          _lineIndex: 2,
          _lineLayer: 0,
          _type: 0,
          _cutDirection: 1,
        },
        {
          _time: 3.5,
          _lineIndex: 3,
          _lineLayer: 0,
          _type: 1,
          _cutDirection: 0,
        },
      ];
      expect(actualResult).toEqual(expectedResult);
    });

    it('converts full-circle', () => {
      const blocks = [
        {
          _time: 2,
          _lineIndex: 2,
          _lineLayer: 0,
          _type: 0,
          _cutDirection: 1,
        },
        {
          _time: 3.5,
          _lineIndex: 3,
          _lineLayer: 0,
          _type: 1,
          _cutDirection: 0,
        },
      ];

      const actualResult = convertBlocksToExportableJson(
        convertBlocksToRedux(blocks)
      );

      const expectedResult = blocks;
      expect(actualResult).toEqual(expectedResult);
    });
  });

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
      const numOfNotes = 15;
      const segmentLengthInBeats = 10;
      const bpm = 100;

      const actualResult = calculateNoteDensity(
        numOfNotes,
        segmentLengthInBeats,
        bpm
      );
      const expectedResult = 2.5;

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

  describe('Mapping Extensions conversions', () => {
    it('converts to MapEx format', () => {
      const notes = [
        { _time: 4, _lineIndex: 0, _lineLayer: 0 },
        { _time: 4, _lineIndex: 1.5, _lineLayer: 2 },
        { _time: 6, _lineIndex: -0.5, _lineLayer: 1 },
        { _time: 8, _lineIndex: 10, _lineLayer: -2.25 },
      ];

      const actualResult = convertNotesToMappingExtensions(notes);
      const expectedResult = [
        { _time: 4, _lineIndex: 1000, _lineLayer: 1000 },
        { _time: 4, _lineIndex: 2500, _lineLayer: 3000 },
        { _time: 6, _lineIndex: -1500, _lineLayer: 2000 },
        { _time: 8, _lineIndex: 11000, _lineLayer: -3250 },
      ];

      expect(actualResult).toEqual(expectedResult);
    });

    it('converts from MapEx format', () => {
      const notes = [
        { _time: 4, _lineIndex: 1000, _lineLayer: 1000 },
        { _time: 4, _lineIndex: 2500, _lineLayer: 3000 },
        { _time: 6, _lineIndex: -1500, _lineLayer: 2000 },
        { _time: 8, _lineIndex: 11000, _lineLayer: -3250 },
      ];

      const actualResult = convertNotesFromMappingExtensions(notes);
      const expectedResult = [
        { _time: 4, _lineIndex: 0, _lineLayer: 0 },
        { _time: 4, _lineIndex: 1.5, _lineLayer: 2 },
        { _time: 6, _lineIndex: -0.5, _lineLayer: 1 },
        { _time: 8, _lineIndex: 10, _lineLayer: -2.25 },
      ];

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
