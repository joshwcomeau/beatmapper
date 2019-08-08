import uuid from 'uuid/v1';

import { Event, LightingEvent, LaserSpeedEvent } from '../types';

const TRACK_ID_MAP = {
  laserBack: 0,
  trackNeons: 1,
  laserLeft: 2,
  laserRight: 3,
  primaryLight: 4,
  largeRing: 8,
  smallRing: 9,
  laserSpeedLeft: 12,
  laserSpeedRight: 13,
};

const LIGHT_EVENT_TYPES = {
  blue: {
    off: 0,
    on: 1,
    flash: 2,
    fade: 3,
  },
  red: {
    off: 0,
    on: 5,
    flash: 6,
    fade: 7,
  },
};

const convertLightingEventToJson = (event: LightingEvent) => {
  return {
    _time: event.beatNum,
    _type: TRACK_ID_MAP[event.trackId],
    // @ts-ignore
    _value: LIGHT_EVENT_TYPES[event.color][event.type],
  };
};

const convertLaserSpeedEventToJson = (event: LaserSpeedEvent) => {
  const type = TRACK_ID_MAP[event.trackId];

  return {
    _time: event.beatNum,
    _type: type,
    _value: event.laserSpeed,
  };
};
const convertRotationEventToJson = (event: LaserSpeedEvent) => {
  const type = TRACK_ID_MAP[event.trackId];

  return {
    _time: event.beatNum,
    _type: type,
    _value: 0,
  };
};

export const convertEventsToRedux = (events: Array<Event>) => {
  return events.map(event => {
    if (
      event.trackId === 'laserSpeedLeft' ||
      event.trackId === 'laserSpeedRight'
    ) {
      // @ts-ignore
      return convertLaserSpeedEventToJson(event);
    } else if (event.trackId === 'smallRing' || event.trackId === 'largeRing') {
      // @ts-ignore
      return convertRotationEventToJson(event);
    } else {
      // @ts-ignore
      return convertLightingEventToJson(event);
    }
  });
};
