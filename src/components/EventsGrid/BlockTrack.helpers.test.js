/**
 * These tests have comments to quickly explain the situation they're testing:
 * 1 [__0_1___]
 *
 * To read this:
 * - The first number, 1 or 0, represents whether the lighting was on in a
 *   previous frame. Whether or not the track is initially lit
 * - The array contains 8 "spots" which can either be blank (no event),
 *   0 (lighting off event), or 1 (lighting on event).
 */
import { getBackgroundBoxes } from './BlockTrack.helpers';

const LIGHTING_TRACK_ID = 'primaryLight';

describe('BlockTrack helpers', () => {
  describe('getBackgroundBoxes', () => {
    it('exits early if it is not a lighting track', () => {
      const trackId = 'laserSpeedLeft';
      const events = [
        // Technically these events are illegal; this is just testing that it
        // doesn't even look at events when the trackId isn't lighting
        {
          trackId,
          beatNum: 3,
          id: 'a',
          type: 'on',
          color: 'red',
        },
        {
          trackId,
          beatNum: 4,
          id: 'b',
          type: 'off',
        },
      ];
      const initialTrackLightingColor = false;
      const startBeat = 0;
      const numOfBeatsToShow = 8;

      const expectedResult = [];
      const actualResult = getBackgroundBoxes(
        events,
        trackId,
        initialTrackLightingColor,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles an empty set of events without initial lighting', () => {
      //  0  [________]
      const events = [];
      const initialTrackLightingColor = false;
      const startBeat = 0;
      const numOfBeatsToShow = 8;

      const expectedResult = [];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColor,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles an empty set of events with initial lighting', () => {
      //  1  [________]
      const events = [];
      const initialTrackLightingColor = 'red';
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        {
          id: 'initial-8-8',
          beatNum: 8,
          duration: 8,
          color: 'red',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColor,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles a basic on-off case', () => {
      //  0  [1___0___]
      const events = [
        {
          id: 'a',
          trackId: 'laserLeft',
          beatNum: 8,
          type: 'on',
          color: 'red',
        },
        {
          id: 'b',
          trackId: 'laserLeft',
          beatNum: 12,
          type: 'off',
        },
      ];
      const initialTrackLightingColor = false;
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        {
          id: 'a',
          beatNum: 8,
          duration: 4,
          color: 'red',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColor,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
