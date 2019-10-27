import get from 'lodash.get';
import Color from 'color';

export const DEFAULT_RED = '#f21212';
export const DEFAULT_BLUE = '#006cff';

export const getColorForItem = (item, song) => {
  switch (item) {
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
    case 'envColorLeft': {
      return get(song, 'modSettings.customColors.envColorLeft') || DEFAULT_RED;
    }
    case 'envColorRight': {
      return (
        get(song, 'modSettings.customColors.envColorRight') || DEFAULT_BLUE
      );
    }

    default:
      throw new Error('Unrecognized item type: ' + item);
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
