import get from 'lodash.get';
import Color from 'color';

import { COLORS } from '../constants';
import { clamp, normalize } from '../utils';

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

const OVERDRIVE_MAX_FOR_ELEMENT = {
  colorLeft: 4,
  colorRight: 4,
  envColorLeft: 2,
  envColorRight: 2,
  obstacleColor: 10,
};

export const formatColorForMods = (element, hex, overdrive) => {
  // For overdrive: every element ranges from 0 (no overdrive) to 1 (full).
  // Different elements are affected by different amounts, though.
  // left/right environment colors range from 1 to 3, whereas obstacles range
  // from 1 to 10.
  const overdriveMultiple = normalize(
    overdrive,
    0,
    1,
    1,
    OVERDRIVE_MAX_FOR_ELEMENT[element]
  );

  const rgb = Color(hex).rgb().color;

  return {
    r: (rgb[0] / 255) * overdriveMultiple,
    g: (rgb[1] / 255) * overdriveMultiple,
    b: (rgb[2] / 255) * overdriveMultiple,
  };
};

// Turn the imported color into a hex string
// NOTE: This is NOT used for maps re-imported; we use _editorSettings
// to store the hex values directly. This is done since we lose "overdrive"
// information when we do it this way :(
// This is only used when importing maps from other editors.
export const formatColorFromImport = rgb => {
  const normalizedRgb = [
    clamp(Math.round(rgb.r * 255), 0, 255),
    clamp(Math.round(rgb.g * 255), 0, 255),
    clamp(Math.round(rgb.b * 255), 0, 255),
  ];

  return Color(normalizedRgb).hex();
};
