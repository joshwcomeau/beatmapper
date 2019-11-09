export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'ExpertPlus';

export type Direction =
  | 'upLeft'
  | 'up'
  | 'upRight'
  | 'right'
  | 'downRight'
  | 'down'
  | 'downLeft'
  | 'left'
  | 'face';

// So, there's probably a proper way to type Redux actions, but boy is it a lot
// of potential work. Instead I'm only going to validate that it has the
// mandatory `type` field.
export type Action = {
  type: string;
  [x: string]: any;
};

// NOTE: This type is unused. Planning to migrate to it, but for now I'm using
// the raw "note" type, with all the underscore-prefixed fields used in-game.
export type BlockNext = {
  id: string;
  struckWith: 'left' | 'right';
  direction: Direction;
  beatNum: number;
  rowIndex: number;
  colIndex: number;
  selected?: boolean;
};

export interface OriginalObstacle {
  id: string;
  // Lane: which of the 4 columns does this box START on?
  lane: 0 | 1 | 2 | 3;
  // Type: Whether this is a vertical wall or a horizontal overhead ceiling
  type: 'wall' | 'ceiling' | 'extension';
  // beatStart: the number of beats that the song starts at
  beatStart: number;
  // beatDuration: the number of beats it should exist for
  beatDuration: number;
  // colspan: the number of columns this lane occupies
  colspan: number;
  // When initially placing an obstacle, it will exist in a limbo state, only
  // becoming real once the user releases the mouse
  tentative?: boolean;
  selected?: boolean;
  // Should the wall fly by as a decorative entity?
  fast?: boolean;
}

export interface MappingExtensionObstacle extends OriginalObstacle {
  type: 'extension';
  rowIndex: number;
  rowspan: number;
}

export type Obstacle = OriginalObstacle | MappingExtensionObstacle;

export type LightingTrackId =
  | 'laserLeft'
  | 'laserRight'
  | 'laserBack'
  | 'primaryLight'
  | 'trackNeons';
export type RingTrackId = 'largeRing' | 'smallRing';
export type LaserSpeedTrackId = 'laserSpeedLeft' | 'laserSpeedRight';

export type TrackId = LightingTrackId | RingTrackId | LaserSpeedTrackId;

export type LightingEventType = 'on' | 'off' | 'flash' | 'fade';
export type RingEventType = 'rotate';
export type LaserSpeedEventType = 'change-speed';

export type EventType =
  | LightingEventType
  | RingEventType
  | LaserSpeedEventType
  | 'custom-pattern';

export type EventColorType = 'red' | 'blue';

export interface BaseEvent {
  id: string;
  trackId: TrackId;
  beatNum: number;
  selected?: true | false | 'tentative';
}

export interface LightingEvent extends BaseEvent {
  trackId: LightingTrackId;
  type: LightingEventType;
  colorType?: EventColorType;
}

export interface RingEvent extends BaseEvent {
  trackId: RingTrackId;
  type: RingEventType;
}

export interface LaserSpeedEvent extends BaseEvent {
  trackId: LaserSpeedTrackId;
  type: LaserSpeedEventType;
  laserSpeed: number;
}

export type Event = LightingEvent | RingEvent | LaserSpeedEvent;
