import {
  convertEventsToExportableJson,
  convertEventsToRedux,
} from './events.helpers';

describe('Event helpers', () => {
  describe('Converting from redux to v2 json', () => {
    it('converts a lighting event', () => {
      const events = [
        {
          id: 'abc',
          trackId: 'primaryLight',
          beatNum: 12,
          type: 'on',
          colorType: 'red',
        },
      ];

      const actualResult = convertEventsToExportableJson(events);
      const expectedResult = [
        {
          _time: 12,
          _type: 4, // track ID
          _value: 5, // event type (red on)
        },
      ];

      expect(actualResult).toEqual(expectedResult);
    });

    it('converts multiple lighting event', () => {
      const events = [
        {
          id: 'abc',
          trackId: 'laserLeft',
          beatNum: 1,
          type: 'flash',
          colorType: 'red',
        },
        {
          id: 'def',
          trackId: 'laserLeft',
          beatNum: 2,
          type: 'off',
        },
        {
          id: 'ghi',
          trackId: 'laserRight',
          beatNum: 2,
          type: 'flash',
          colorType: 'blue',
        },
        {
          id: 'jkl',
          trackId: 'laserRight',
          beatNum: 3,
          type: 'off',
        },
      ];

      const actualResult = convertEventsToExportableJson(events);
      const expectedResult = [
        { _time: 1, _type: 2, _value: 6 },
        { _time: 2, _type: 2, _value: 0 },
        { _time: 2, _type: 3, _value: 2 },
        { _time: 3, _type: 3, _value: 0 },
      ];

      expect(actualResult).toEqual(expectedResult);
    });

    it('converts laser speed and rotation events', () => {
      const events = [
        {
          id: 'abc',
          trackId: 'smallRing',
          beatNum: 1,
        },
        {
          id: 'abc',
          trackId: 'largeRing',
          beatNum: 1,
        },
        {
          id: 'abc',
          trackId: 'laserSpeedLeft',
          beatNum: 2,
          laserSpeed: 8,
        },
        {
          id: 'abc',
          trackId: 'laserSpeedRight',
          beatNum: 2,
          laserSpeed: 2,
        },
      ];
      const actualResult = convertEventsToExportableJson(events);
      const expectedResult = [
        { _time: 1, _type: 9, _value: 0 },
        { _time: 1, _type: 8, _value: 0 },
        { _time: 2, _type: 12, _value: 8 },
        { _time: 2, _type: 13, _value: 2 },
      ];
      expect(actualResult).toEqual(expectedResult);
    });
  });

  // We can't just compare actual to expected because IDs are randomly
  // generated within the method :/
  const compareExceptId = (actual, expected) => {
    const actualClone = actual.map(ev => {
      let clone = { ...ev };
      delete clone.id;
      return clone;
    });
    const expectedClone = expected.map(ev => {
      let clone = { ...ev };
      delete clone.id;
      return clone;
    });

    expect(actualClone).toEqual(expectedClone);
  };

  describe('Converting from v2 json to redux', () => {
    it('converts a lighting event', () => {
      const events = [
        {
          _time: 12,
          _type: 4, // track ID
          _value: 5, // event type (red on)
        },
      ];

      const actualResult = convertEventsToRedux(events);
      const expectedResult = [
        {
          id: 'abc',
          trackId: 'primaryLight',
          beatNum: 12,
          type: 'on',
          colorType: 'red',
        },
      ];

      compareExceptId(actualResult, expectedResult);
    });

    it('converts multiple lighting event', () => {
      const events = [
        { _time: 1, _type: 2, _value: 6 },
        { _time: 2, _type: 2, _value: 0 },
        { _time: 2, _type: 3, _value: 2 },
        { _time: 3, _type: 3, _value: 0 },
      ];

      const actualResult = convertEventsToRedux(events);
      const expectedResult = [
        {
          id: 'abc',
          trackId: 'laserLeft',
          beatNum: 1,
          type: 'flash',
          colorType: 'red',
        },
        {
          id: 'def',
          trackId: 'laserLeft',
          beatNum: 2,
          type: 'off',
        },
        {
          id: 'ghi',
          trackId: 'laserRight',
          beatNum: 2,
          type: 'flash',
          colorType: 'blue',
        },
        {
          id: 'jkl',
          trackId: 'laserRight',
          beatNum: 3,
          type: 'off',
        },
      ];

      compareExceptId(actualResult, expectedResult);
    });

    it('converts laser speed and rotation events', () => {
      const events = [
        { _time: 1, _type: 9, _value: 0 },
        { _time: 1, _type: 8, _value: 0 },
        { _time: 2, _type: 12, _value: 8 },
        { _time: 2, _type: 13, _value: 2 },
      ];

      const actualResult = convertEventsToRedux(events);
      const expectedResult = [
        {
          id: 'abc',
          trackId: 'smallRing',
          beatNum: 1,
          type: 'rotate',
        },
        {
          id: 'abc',
          trackId: 'largeRing',
          beatNum: 1,
          type: 'rotate',
        },
        {
          id: 'abc',
          trackId: 'laserSpeedLeft',
          beatNum: 2,
          laserSpeed: 8,
        },
        {
          id: 'abc',
          trackId: 'laserSpeedRight',
          beatNum: 2,
          laserSpeed: 2,
        },
      ];
      compareExceptId(actualResult, expectedResult);
    });
  });
});
