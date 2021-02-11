import localforage from 'localforage';

import defaultCoverArtPath from '../assets/images/placeholder-cover-art.jpg';

import { Difficulty } from '../types';

// These are the types of things we'll need to save.
type ThingType = 'song' | 'cover-art' | 'info' | 'beatmap';

// These are the types of things we're able to save
type Saveable = File | Blob | string;

// All functions that save a file should return a promise that resolves to
// an array of the filename and its file (or blob).
type SaveReturn = Promise<[string, Saveable | string]>;

const filestore = localforage.createInstance({
  name: 'BeatMapper files',
});

filestore.config({
  driver: localforage.INDEXEDDB,
  name: 'beat-mapper-files',
});

/**
 * LOW-LEVEL UTILS
 *
 *
 * Low-level generic utilities.
 * Ideally, shouldn't be used outside this file.
 */
export const saveFile = (filename: string, file: Saveable): SaveReturn => {
  return filestore.setItem(filename, file).then(() => [filename, file]);
};

export const getFile = (filename: string): Promise<Saveable | null> => {
  return filestore.getItem(filename);
};

export const deleteFile = (filename: string): Promise<void> => {
  return filestore.removeItem(filename);
};
export const deleteFiles = (filenames: Array<string>): Promise<Array<void>> => {
  // prettier-ignore
  return Promise.all(
    filenames.map(filename => filestore.removeItem(filename))
  );
};

const getExtension = (filename: string, defaultExtension: string = '') => {
  const match = filename.match(/\.[a-zA-Z]+$/);

  if (!match) {
    return defaultExtension;
  }

  return match[0].slice(1);
};

/**
 * HELPERS
 *
 *
 */

/**
 * Name looker-upper.
 *
 * @example getFilenameForThing(123, 'song')
 *  -> `123_song.ogg`
 * @example getFilenameForThing(123, 'cover-art', { extension: 'jpg' })
 *  -> `123_cover.jpg`
 * @example getFilenameForThing(123, 'beatmap', { difficulty: 'ExpertPlus' })
 *  -> `123_ExpertPlus.dat`
 */
type Metadata = { extension?: string; difficulty?: Difficulty };
export const getFilenameForThing = (
  songId: string,
  type: ThingType,
  metadata: Metadata = {}
) => {
  switch (type) {
    case 'song': {
      return `${songId}_song.ogg`;
    }

    case 'cover-art': {
      if (!metadata.extension) {
        throw new Error('Must supply a file extension for cover art.');
      }

      return `${songId}_cover.${metadata.extension}`;
    }

    case 'info': {
      return `${songId}_Info.dat`;
    }

    case 'beatmap': {
      if (!metadata.difficulty) {
        throw new Error('Must supply a difficulty for beatmaps.');
      }

      return `${songId}_${metadata.difficulty}.dat`;
    }

    default:
      throw new Error('Unrecognized type: ' + type);
  }
};

/**
 * PERSISTENCE AND RETRIEVAL METHODS
 *
 * Sugar around `saveFile` and `getFile`. Ideally, the app should use these
 * helpers so that all of the concerns around filename resolution happens
 * in one place, and isn't spread across the app.
 */

export const getBeatmap = (
  songId: string,
  difficulty: Difficulty
): Promise<Object> => {
  // Start by getting the entities (notes, events, etc) for this map
  const beatmapFilename = getFilenameForThing(songId, 'beatmap', {
    difficulty,
  });

  return getFile(beatmapFilename).then(beatmapContents => {
    if (!beatmapContents) {
      return null;
    }

    if (typeof beatmapContents === 'string') {
      return JSON.parse(beatmapContents);
    } else {
      throw new Error(
        'Expected beatmapFilename to load a string, loaded: ' +
        typeof beatmapContents
      );
    }
  });
};

export const saveSongFile = (songId: string, songFile: File | Blob) => {
  const songFilename = getFilenameForThing(songId, 'song');
  return saveFile(songFilename, songFile);
};

const saveBackupCoverArt = (songId: string): SaveReturn => {
  // If the user doesn't have a cover image yet, we'll supply a default.
  // Ideally we'd need a File, to be consistent with the File we get from
  // a locally-selected file, but a Blob is near-identical.
  // If it looks like a duck, etc.
  //
  // I need to convert the file URL I have into a Blob, and then save that
  // to indexedDB.
  //
  // TODO: I should first check and see if the user has already saved this
  // placeholder, so that I can skip overwriting it.
  const pathPieces = defaultCoverArtPath.split('/');
  const coverArtFilename = pathPieces[pathPieces.length - 1];

  return window
    .fetch(defaultCoverArtPath)
    .then(res => res.blob())
    .then((blob: Blob) => saveFile(coverArtFilename, blob));
};

export const saveLocalCoverArtFile = (
  songId: string,
  coverArtFile?: File
): SaveReturn => {
  if (coverArtFile) {
    const extension = getExtension(coverArtFile.name, 'unknown');
    const coverArtFilename = getFilenameForThing(songId, 'cover-art', {
      extension,
    });

    return saveFile(coverArtFilename, coverArtFile);
  } else {
    return saveBackupCoverArt(songId);
  }
};

export const saveCoverArtFromBlob = (
  songId: string,
  coverArtBlob?: Blob,
  originalCoverArtFilename?: string
): SaveReturn => {
  if (coverArtBlob) {
    // When uploading a .zip file, we don't have a File object for the image,
    // we get a Blob instead. Blobs don't have a `name` property, so instead we
    // need it to be passed as a 5th parameter.
    if (typeof originalCoverArtFilename === 'undefined') {
      throw new Error(
        'You must supply an original filename when saving cover art as a Blob instead of a File.'
      );
    }

    const extension = getExtension(originalCoverArtFilename, 'unknown');

    const coverArtFilename = getFilenameForThing(songId, 'cover-art', {
      extension,
    });

    return saveFile(coverArtFilename, coverArtBlob);
  } else {
    return saveBackupCoverArt(songId);
  }
};

export const saveBeatmap = (
  songId: string,
  difficulty: Difficulty,
  beatmapContents: string
) => {
  const beatmapFilename = getFilenameForThing(songId, 'beatmap', {
    difficulty,
  });

  // Make sure we're saving a stringified object.
  let beatmapContentsString = beatmapContents;
  if (typeof beatmapContents === 'object') {
    beatmapContentsString = JSON.stringify(beatmapContents);
  }

  return saveFile(beatmapFilename, beatmapContentsString);
};

export const saveInfoDat = (songId: string, infoContent: string) => {
  const infoDatFilename = getFilenameForThing(songId, 'info');

  return saveFile(infoDatFilename, infoContent);
};

export const deleteAllSongFiles = async (song: any) => {
  /**
   * If the user deletes a song, we have a lot of stuff to get rid of:
   *   - Song file (.ogg)
   *   - Cover art
   *   - All difficulty beatmaps
   *   - Info.dat
   */
  const { id, songFilename, coverArtFilename, difficultiesById } = song;

  const infoDatName = getFilenameForThing(id, 'info');
  const beatmapFilenames = Object.keys(difficultiesById).map(difficultyId => {
    // @ts-ignore
    return getFilenameForThing(id, 'beatmap', { difficulty: difficultyId });
  });

  try {
    await deleteFile(songFilename);
    await deleteFile(coverArtFilename);
    await deleteFile(infoDatName);
    await deleteFiles(beatmapFilenames);
    console.info(`Successfully deleted all files related to ${id}.`);
  } catch (err) {
    console.error('Could not delete all files for song:', err);
  }
};
