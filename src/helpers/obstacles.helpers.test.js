import {
  convertObstaclesToRedux,
  convertObstaclesToExportableJson,
} from './obstacles.helpers';

const SAMPLE_PROPRIETARY_DATA = [
  { _time: 0, _lineIndex: 0, _type: 0, _duration: 1, _width: 1 },
  { _time: 2, _lineIndex: 1, _type: 0, _duration: 2, _width: 1 },
  { _time: 9, _lineIndex: 0, _type: 0, _duration: 1, _width: 2 },
  { _time: 11, _lineIndex: 2, _type: 0, _duration: 1, _width: 1 },
  { _time: 14, _lineIndex: 0, _type: 1, _duration: 1, _width: 4 },
  { _time: 17, _lineIndex: 0, _type: 0, _duration: 1, _width: 4 },
  // Invalid, should truncate:
  { _time: 17, _lineIndex: 2, _type: 0, _duration: 1, _width: 10 },
];

const SAMPLE_REDUX_DATA = [
  { id: 'a', beatStart: 2, beatDuration: 4, lane: 0, type: 'wall', colspan: 2 },
  {
    id: 'b',
    beatStart: 4,
    beatDuration: 0,
    lane: 2,
    type: 'ceiling',
    colspan: 2,
  },
  { id: 'c', beatStart: 4, beatDuration: 4, lane: 0, type: 'wall', colspan: 1 },
];

describe('Obstacles helpers', () => {
  it('converts an array of objects to redux', () => {
    const actualResult = convertObstaclesToRedux(SAMPLE_PROPRIETARY_DATA);

    // The method adds random IDs to every entity.
    // We can't compare them directly since we don't know the IDs.
    const actualWithoutIds = actualResult.map(r => {
      const copy = { ...r };
      delete copy.id;

      return copy;
    });

    // Do verify that IDs are added though!
    actualResult.forEach(result => {
      expect(typeof result.id).toEqual('string');
    });

    const expectedResult = [
      { beatStart: 0, beatDuration: 1, lane: 0, type: 'wall', colspan: 1 },
      { beatStart: 2, beatDuration: 2, lane: 1, type: 'wall', colspan: 1 },
      { beatStart: 9, beatDuration: 1, lane: 0, type: 'wall', colspan: 2 },
      { beatStart: 11, beatDuration: 1, lane: 2, type: 'wall', colspan: 1 },
      {
        beatStart: 14,
        beatDuration: 1,
        lane: 0,
        type: 'ceiling',
        colspan: 4,
      },
      { beatStart: 17, beatDuration: 1, lane: 0, type: 'wall', colspan: 4 },
      { beatStart: 17, beatDuration: 1, lane: 2, type: 'wall', colspan: 2 },
    ];

    expect(actualWithoutIds).toEqual(expectedResult);
  });

  it('converts from redux to proprietary', () => {
    const actualResult = convertObstaclesToExportableJson(SAMPLE_REDUX_DATA);
    const expectedResult = [
      { _time: 2, _lineIndex: 0, _type: 0, _duration: 4, _width: 2 },
      { _time: 4, _lineIndex: 2, _type: 1, _duration: 0, _width: 2 },
      { _time: 4, _lineIndex: 0, _type: 0, _duration: 4, _width: 1 },
    ];

    expect(actualResult).toEqual(expectedResult);
  });

  it('converts full-circle', () => {
    const validData = SAMPLE_PROPRIETARY_DATA.slice(0, 3);
    const actualResult = convertObstaclesToExportableJson(
      convertObstaclesToRedux(validData)
    );
    const expectedResult = validData;

    expect(actualResult).toEqual(expectedResult);
  });
});
