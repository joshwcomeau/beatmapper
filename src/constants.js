import { getMetaKeyLabel } from './utils';

export const COLORS = {
  gray: {
    '100': 'hsl(0, 0%, 92%)',
    '300': 'hsl(0, 0%, 60%)',
    '500': 'hsl(0, 0%, 28%)',
    '700': 'hsl(0, 0%, 14%)',
    '900': 'hsl(0, 0%, 7%)',
  },
  blueGray: {
    '100': 'hsl(222, 4%, 92%)',
    '300': 'hsl(222, 7%, 60%)',
    '400': 'hsl(222, 8.5%, 42%)',
    '500': 'hsl(222, 10%, 28%)',
    '700': 'hsl(222, 15%, 18%)',
    '900': 'hsl(222, 25%, 12%)',
    '1000': 'hsl(222, 30%, 7%)',
  },
  pink: {
    '500': 'hsl(310, 100%, 50%)',
    '700': 'hsl(302, 100%, 42%)',
  },
  red: {
    '300': 'hsl(360, 100%, 75%)',
    '500': 'hsl(360, 100%, 50%)',
    '700': 'hsl(350, 80%, 30%)',
  },
  blue: {
    '500': 'hsl(212, 100%, 45%)',
    '700': 'hsl(222, 100%, 40%)',
  },
  yellow: {
    '500': 'hsl(48, 100%, 60%)',
  },
  green: {
    '500': 'hsl(160, 100%, 45%)',
    '700': 'hsl(165, 100%, 30%)',
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const DEVTOOLS_ENABLED_IN_DEV = true;

export const BLOCK_SIZE = 1;
export const BLOCK_COLUMN_WIDTH = BLOCK_SIZE * 1.5;
export const BLOCK_PLACEMENT_SQUARE_SIZE = BLOCK_COLUMN_WIDTH;
export const BEAT_DEPTH = BLOCK_SIZE * 8;
export const SONG_OFFSET = 6;

// How wide is the platform the notes float above?
export const SURFACE_WIDTH = 6;

export const UNIT = 8;

export const HEADER_HEIGHT = 75;
export const FOOTER_HEIGHT = 100;

export const SIDEBAR_WIDTH = 55;

export const DIFFICULTIES = ['Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus'];

export const DIFFICULTY_COLORS = {
  Easy: '#4AFFBE',
  Normal: '#FCFF6A',
  Hard: '#4AE9FF',
  Expert: '#FF4A6B',
  ExpertPlus: '#FF5FF9',
};

const metaKeyLabel = getMetaKeyLabel();

export const SNAPPING_INCREMENTS = [
  {
    value: 1 / 16,
    label: '1/16 Beat',
    shortcutKey: 1,
    shortcutLabel: `${metaKeyLabel}+1`,
  },
  {
    value: 1 / 12,
    label: '1/12 Beat',
  },
  {
    value: 1 / 8,
    label: '1/8 Beat',
    shortcutKey: 2,
    shortcutLabel: `${metaKeyLabel}+2`,
  },
  {
    value: 1 / 6,
    label: '1/6 Beat',
  },
  {
    value: 1 / 4,
    label: '1/4 Beat',
    shortcutKey: 3,
    shortcutLabel: `${metaKeyLabel}+3`,
  },
  {
    value: 1 / 3,
    label: '1/3 Beat',
  },
  {
    value: 1 / 2,
    label: '1/2 Beat',
    shortcutKey: 4,
    shortcutLabel: `${metaKeyLabel}+4`,
  },
  {
    value: 1,
    label: '1 Beat',
    shortcutKey: 5,
    shortcutLabel: `${metaKeyLabel}+5`,
  },
  {
    value: 2,
    label: '2 Beats',
    shortcutKey: 6,
    shortcutLabel: `${metaKeyLabel}+6`,
  },
  {
    value: 4,
    label: '1 Bar',
    shortcutKey: 7,
    shortcutLabel: `${metaKeyLabel}+7`,
  },
  {
    value: 8,
    label: '2 Bars',
    shortcutKey: 8,
    shortcutLabel: `${metaKeyLabel}+8`,
  },
  {
    value: 16,
    label: '4 Bars',
    shortcutKey: 9,
    shortcutLabel: `${metaKeyLabel}+9`,
  },
];

export const NOTES_VIEW = 'notes';
export const EVENTS_VIEW = 'events';
