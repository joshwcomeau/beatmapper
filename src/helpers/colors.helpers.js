import get from 'lodash.get';
import Color from 'color';

import { COLORS } from '../constants';

export const DEFAULT_RED = '#f21212';
export const DEFAULT_BLUE = '#006cff';

export const getColorForItem = (item, song) => {
  switch (item) {
    // In our notes view, the tool will be labeled "left-block", while the
    // underlying data structure treats colors as a number: 0, 1, 3.
    case 'left-block':
    case 0: {
      return get(song, 'modSettings.customColors.colorLeft') || DEFAULT_RED;
    }
    case 'right-block':
    case 1: {
      return get(song, 'modSettings.customColors.colorRight') || DEFAULT_BLUE;
    }
    case 'mine':
    case 3: {
      return '#687485';
    }
    case 'obstacle': {
      return get(song, 'modSettings.customColors.obstacleColor') || DEFAULT_RED;
    }

    // In the events view, our formal name is `envColorLeft`, but the events
    // themselves still use the original colors 'red' / 'blue'.
    case 'envColorLeft':
    case 'red': {
      return get(song, 'modSettings.customColors.envColorLeft') || DEFAULT_RED;
    }
    case 'envColorRight':
    case 'blue': {
      return (
        get(song, 'modSettings.customColors.envColorRight') || DEFAULT_BLUE
      );
    }

    // Event view has two other event types: rotate and off. They have unique
    // colors.
    case 'rotate':
      return COLORS.green[500];
    case 'off':
      return COLORS.blueGray[400];

    default:
      return undefined;
  }
};

export const formatColorForMods = hex => {
  const rgb = Color(hex).rgb().color;

  return {
    r: rgb[0] / 255,
    g: rgb[1] / 255,
    b: rgb[2] / 255,
  };
};

export const formatColorFromImport = rgb => {
  const normalizedRgb = [
    Math.round(rgb.r * 255),
    Math.round(rgb.g * 255),
    Math.round(rgb.b * 255),
  ];

  return Color(normalizedRgb).hex();
};
