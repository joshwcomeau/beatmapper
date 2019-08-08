import { convertEventsToRedux } from './events.helpers';

describe('Event helpers', () => {
  describe('Converting from redux to v2 json', () => {
    it('converts a lighting event', () => {
      const events = [
        {
          id: 'abc',
          trackId: 'primaryLight',
          beatNum: 12,
          type: 'on',
          color: 'red',
        },
      ];

      const actualResult = convertEventsToRedux(events);
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
          color: 'red',
        },
        {
          id: 'def',
          trackId: 'laserLeft',
          beatNum: 2,
          type: 'off',
          color: 'red',
        },
        {
          id: 'ghi',
          trackId: 'laserRight',
          beatNum: 2,
          type: 'flash',
          color: 'blue',
        },
        {
          id: 'jkl',
          trackId: 'laserRight',
          beatNum: 3,
          type: 'off',
          color: 'blue',
        },
      ];

      const actualResult = convertEventsToRedux(events);
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
      const actualResult = convertEventsToRedux(events);
      const expectedResult = [
        { _time: 1, _type: 9, _value: 0 },
        { _time: 1, _type: 8, _value: 0 },
        { _time: 2, _type: 12, _value: 8 },
        { _time: 2, _type: 13, _value: 2 },
      ];
      expect(actualResult).toEqual(expectedResult);
    });
  });
});
