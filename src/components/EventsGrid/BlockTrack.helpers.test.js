/**
 * These tests have comments to quickly explain the situation they're testing:
 * R [__0_B___]
 *
 * To read this:
 * - The "array" holds 8 beats, representing the event-grid for a given frame.
 * - The frame can have `R` events (Red light on), `B` events (Blue light on),
 *   or `0` (light off)
 * - The letter to the left of the array represents the initial light value,
 *   the value it held before the current frame started
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
          colorType: 'red',
        },
        {
          trackId,
          beatNum: 4,
          id: 'b',
          type: 'off',
        },
      ];
      const initialTrackLightingColorType = false;
      const startBeat = 0;
      const numOfBeatsToShow = 8;

      const expectedResult = [];
      const actualResult = getBackgroundBoxes(
        events,
        trackId,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles an empty set of events without initial lighting', () => {
      //  0  [________]
      const events = [];
      const initialTrackLightingColorType = false;
      const startBeat = 0;
      const numOfBeatsToShow = 8;

      const expectedResult = [];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles an empty set of events WITH initial lighting', () => {
      //  R  [________]
      const events = [];
      const initialTrackLightingColorType = 'red';
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        {
          id: 'initial-8-8',
          beatNum: 8,
          duration: 8,
          colorType: 'red',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles a basic on-off case', () => {
      //  0  [R___0___]
      const events = [
        {
          id: 'a',
          trackId: 'laserLeft',
          beatNum: 8,
          type: 'on',
          colorType: 'red',
        },
        {
          id: 'b',
          trackId: 'laserLeft',
          beatNum: 12,
          type: 'off',
        },
      ];
      const initialTrackLightingColorType = false;
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        {
          id: 'a',
          beatNum: 8,
          duration: 4,
          colorType: 'red',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles turning on when already on', () => {
      //  R  [____R___]
      const events = [
        {
          id: 'a',
          trackId: 'laserLeft',
          beatNum: 12,
          type: 'on',
          colorType: 'red',
        },
      ];
      const initialTrackLightingColorType = 'red';
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        // Should be a single box filling the available space.
        {
          id: 'initial-8-8',
          beatNum: 8,
          duration: 8,
          colorType: 'red',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });

    it('handles color changes', () => {
      //  0  [R___B_0_]
      const events = [
        {
          id: 'a',
          trackId: 'laserLeft',
          beatNum: 8,
          type: 'on',
          colorType: 'red',
        },
        {
          id: 'b',
          trackId: 'laserLeft',
          beatNum: 12,
          type: 'on',
          colorType: 'blue',
        },
        {
          id: 'b',
          trackId: 'laserLeft',
          beatNum: 14,
          type: 'off',
        },
      ];
      const initialTrackLightingColorType = false;
      const startBeat = 8;
      const numOfBeatsToShow = 8;

      const expectedResult = [
        {
          id: 'a',
          beatNum: 8,
          duration: 4,
          colorType: 'red',
        },
        {
          id: 'b',
          beatNum: 12,
          duration: 2,
          colorType: 'blue',
        },
      ];
      const actualResult = getBackgroundBoxes(
        events,
        LIGHTING_TRACK_ID,
        initialTrackLightingColorType,
        startBeat,
        numOfBeatsToShow
      );

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
