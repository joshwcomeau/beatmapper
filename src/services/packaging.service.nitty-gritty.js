import { roundAwayFloatingPointNonsense, isEmpty } from '../utils';
import { convertMillisecondsToBeats } from '../helpers/audio.helpers';
import { formatColorFromImport } from '../helpers/colors.helpers';
import { DEFAULT_GRID } from '../helpers/grid.helpers';

export const getFileFromArchive = (archive, filename) => {
  // Ideally, our .zip archive will just have all the files we need.
  // For usability, though, I'd like to also support selecting a

  const allFilenamesInArchive = Object.keys(archive.files);
  const matchingFilename = allFilenamesInArchive.find(name =>
    name.toLowerCase().includes(filename.toLowerCase())
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
  // the file type; v1 has `info.json` while v2 has `Info.dat`
  // TODO: More reliable version checking
  return getFileFromArchive(archive, 'Info.dat') ? 2 : 1;
};

const shiftEntitiesByOffsetInBeats = (entities, offsetInBeats) => {
  return entities.map(entity => {
    let time = roundAwayFloatingPointNonsense(entity._time + offsetInBeats);

    // For some reason, with offsets we can end up with a time of -0, which
    // doesn't really make sense.
    if (time === -0) {
      time = 0;
    }
    return {
      ...entity,
      _time: time,
    };
  });
};

export const shiftEntitiesByOffset = (entities, offset, bpm) => {
  const offsetInBeats = convertMillisecondsToBeats(offset, bpm);

  return shiftEntitiesByOffsetInBeats(entities, offsetInBeats);
};

export const unshiftEntitiesByOffset = (entities, offset, bpm) => {
  let offsetInBeats = convertMillisecondsToBeats(offset, bpm);

  // Because we're UNshifting, we need to invert the offset
  offsetInBeats *= -1;

  return shiftEntitiesByOffsetInBeats(entities, offsetInBeats);
};

export const deriveDefaultModSettingsFromBeatmap = beatmapSet => {
  const modSettings = {};

  beatmapSet._difficultyBeatmaps.forEach(beatmap => {
    if (!beatmap._customData) {
      return;
    }

    if (
      Array.isArray(beatmap._customData._requirements) &&
      beatmap._customData._requirements.includes('Mapping Extensions')
    ) {
      modSettings.mappingExtensions = {
        isEnabled: true,
        // TODO: Should I save and restore the grid settings?
        ...DEFAULT_GRID,
      };
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
        modSettings.customColors = {
          isEnabled: true,
          ...customColors,
        };
      }
    }
  });

  return modSettings;
};
