import Color from 'color';

export const DEFAULT_RED = '#f03030';

export const DEFAULT_BLUE = '#309eff';

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
