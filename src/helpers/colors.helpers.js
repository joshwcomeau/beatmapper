import get from 'lodash.get';
import Color from 'color';

import { COLORS } from '../constants';

export const DEFAULT_RED = '#f21212';
export const DEFAULT_BLUE = '#006cff';

export const getColorForItem = (item, song) => {
  const customColorsEnabled = get(song, 'modSettings.customColors.isEnabled');

  switch (item) {
    // In our notes view, the tool will be labeled "left-block", while the
    // underlying data structure treats colors as a number: 0, 1, 3.
    case 'left-block':
    case 0: {
      const defaultColor = DEFAULT_RED;
      const customColor =
        get(song, 'modSettings.customColors.colorLeft') || defaultColor;

      return customColorsEnabled ? customColor : defaultColor;
    }
    case 'right-block':
    case 1: {
      const defaultColor = DEFAULT_BLUE;
      const customColor =
        get(song, 'modSettings.customColors.colorRight') || defaultColor;

      return customColorsEnabled ? customColor : defaultColor;
    }
    case 'mine':
    case 3: {
      return '#687485';
    }
    case 'obstacle': {
      const defaultColor = DEFAULT_RED;
      const customColor =
        get(song, 'modSettings.customColors.obstacleColor') || defaultColor;

      return customColorsEnabled ? customColor : defaultColor;
    }

    // In the events view, our formal name is `envColorLeft`, but the events
    // themselves still use the original colors 'red' / 'blue'.
    case 'envColorLeft':
    case 'red': {
      const defaultColor = DEFAULT_RED;
      const customColor =
        get(song, 'modSettings.customColors.envColorLeft') || defaultColor;

      return customColorsEnabled ? customColor : defaultColor;
    }
    case 'envColorRight':
    case 'blue': {
      const defaultColor = DEFAULT_BLUE;
      const customColor =
        get(song, 'modSettings.customColors.envColorRight') || defaultColor;

      return customColorsEnabled ? customColor : defaultColor;
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
