import { roundToNearest } from '../utils';
import { convertMillisecondsToBeats } from '../helpers/audio.helpers';

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
    // I never expect to need more granularity than 1/64, so let's round by
    // that.
    _time: roundToNearest(entity._time - offsetInBeats, 1 / 64),
  }));
};
