import { roundToNearest, isEmpty } from '../utils';
import { convertMillisecondsToBeats } from '../helpers/audio.helpers';
import { formatColorFromImport } from '../helpers/colors.helpers';

export const getFileFromArchive = (archive, filename) => {
  // Ideally, our .zip archive will just have all the files we need.
  // For usability, though, I'd like to also support selecting a

  const allFilenamesInArchive = Object.keys(archive.files);
  const matchingFilename = allFilenamesInArchive.find(name =>
    name.includes(filename)
  );

  return archive.files[matchingFilename];
};

export const getDifficultyRankForDifficulty = difficulty => {
  // prettier-ignore
  switch (difficulty.id) {
    case 'Easy': return 1;
    case 'Normal': return 3;
    case 'Hard': return 5;
    case 'Expert': return 7;
    case 'ExpertPlus': return 9;
    default: throw new Error('Unrecognized difficulty')
  }
};

export const getArchiveVersion = archive => {
  // We could be importing a v1 or v2 song, we don't know which.
  // For now, I'm going to do the very lazy thing of just assuming based on
  // the file type; v1 has `info.json` while v2 has `info.dat`
  // TODO: More reliable version checking
  return getFileFromArchive(archive, 'info.dat') ? 2 : 1;
};

export const shiftEntitiesByOffset = (entities, offset, bpm) => {
  const offsetInBeats = convertMillisecondsToBeats(offset, bpm);

  return entities.map(entity => ({
    ...entity,
    _time: entity._time + offsetInBeats,
  }));
};

export const unshiftEntitiesByOffset = (entities, offset, bpm) => {
  const offsetInBeats = convertMillisecondsToBeats(offset, bpm);

  return entities.map(entity => ({
    ...entity,
    // So because we're doing floating-point stuff, we want to avoid any
    // subtle drift caused by the conversion imprecision.
    // Numbers like 31.999999999999996.
    // At the same time, I want to allow legit repeating values like 1.3333,
    // Since thirds of time is valid! This rounding value seems to be the sweet spot.
    _time: roundToNearest(entity._time - offsetInBeats, 1 / 100000000),
  }));
};

export const getModSettingsForBeatmap = beatmapSet => {
  const modSettings = {};

  beatmapSet._difficultyBeatmaps.forEach(beatmap => {
    if (!beatmap._customData) {
      return;
    }

    // Multiple beatmap difficulties might set custom colors, but Beatmapper
    // only supports a single set of colors for all difficulties.
    // If we set any custom colors on previous beatmaps, we can skip this.
    if (!modSettings.customColors) {
      let customColors = {};
      const colorKeys = [
        'colorLeft',
        'colorRight',
        'envColorLeft',
        'envColorRight',
        'obstacleColor',
      ];

      colorKeys.forEach(key => {
        const _key = `_${key}`;

        if (beatmap._customData[_key]) {
          customColors[key] = formatColorFromImport(beatmap._customData[_key]);
        }
      });

      // Only add `customColors` if we have at least 1 of these fields set.
      // If this difficulty doesn't set custom settings, we want to do nothing,
      // since this is how the app knows whether custom colors are enabled
      // or not.
      if (!isEmpty(customColors)) {
        modSettings.customColors = customColors;
      }
    }
  });

  return modSettings;
};
