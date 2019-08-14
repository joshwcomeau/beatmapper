/**
 * This service zips up the current state, to let the user download it.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import {
  saveFile,
  getFile,
  getFilenameForThing,
  saveSongFile,
  saveCoverArtFromBlob,
} from './file.service';
import { getSongIdFromName, sortDifficultyIds } from '../helpers/song.helpers';
import { convertEventsToExportableJson } from '../helpers/events.helpers';
import { convertObstaclesToExportableJson } from '../helpers/obstacles.helpers';
import {
  getNotes,
  getObstacles,
} from '../reducers/editor-entities.reducer/notes-view.reducer';
import { getAllEventsAsArray } from '../reducers/editor-entities.reducer/events-view.reducer';
import {
  getSelectedSong,
  getSelectedSongDifficultyIds,
} from '../reducers/songs.reducer';
import {
  getDifficultyRankForDifficulty,
  getArchiveVersion,
  shiftEntitiesByOffset,
} from './packaging.service.nitty-gritty';

export function createInfoContent(song, meta = { version: 2 }) {
  const difficultyIds = sortDifficultyIds(Object.keys(song.difficultiesById));
  const difficulties = difficultyIds.map(id => song.difficultiesById[id]);

  // We need to make sure we store numbers as numbers.
  // This SHOULD be done at a higher level, but may not be.
  const bpm = Number(song.bpm);
  const offset = Number(song.offset);

  let contents;
  if (meta.version === 1) {
    contents = {
      songName: song.name,
      songSubName: song.subName,
      authorName: song.artistName,
      beatsPerMinute: bpm,
      previewStartTime: song.previewStartTime,
      previewDuration: song.previewDuration,
      coverImagePath: 'cover.jpg',
      environmentName: song.environment,
      difficultyLevels: difficulties.map(difficulty => ({
        difficulty: difficulty.id,
        difficultyRank: getDifficultyRankForDifficulty(difficulty),
        audioPath: 'song.ogg',
        jsonPath: `${difficulty.id}.json`,
        offset: offset,
        oldOffset: offset,
      })),
    };
  } else if (meta.version === 2) {
    contents = {
      _version: '2.0.0',
      _songName: song.name,
      _songSubName: song.subName || '',
      _songAuthorName: song.artistName,
      _levelAuthorName: song.mapAuthorName || '',
      _beatsPerMinute: bpm,
      _songTimeOffset: 0,
      _shuffle: 0,
      _shufflePeriod: 0.5,
      _previewStartTime: song.previewStartTime,
      _previewDuration: song.previewDuration,
      _songFilename: 'song.egg',
      _coverImageFilename: 'cover.jpg',
      _environmentName: song.environment,
      _customData: {
        _contributors: [],
        _customEnvironment: '',
        _customEnvironmentHash: '',
      },
      _difficultyBeatmapSets: [
        {
          _beatmapCharacteristicName: 'Standard',
          _difficultyBeatmaps: difficulties.map(difficulty => ({
            _difficulty: difficulty.id,
            _difficultyRank: getDifficultyRankForDifficulty(difficulty),
            _beatmapFilename: `${difficulty.id}.dat`,
            _noteJumpMovementSpeed: difficulty.noteJumpSpeed,
            _noteJumpStartBeatOffset: difficulty.startBeatOffset,
            _customData: {
              _editorOffset: offset,
              _difficultyLabel: '',
              _warnings: [],
              _information: [],
              _suggestions: [],
              _requirements: [],
            },
          })),
        },
      ],
    };
  } else {
    throw new Error('Unrecognized version: ' + meta.version);
  }

  return JSON.stringify(contents, null, 2);
}

function createBeatmapContents(
  notes,
  events = [],
  obstacles = [],
  meta = { version: 2 },
  // The following fields are only necessary for v1.
  bpm,
  noteJumpSpeed,
  swing,
  swingPeriod
) {
  let contents;

  // We need to sort all notes, obstacles, and events, since the game can be
  // funny when things aren't in order.
  let sortedNotes = notes.sort((a, b) => a._time - b._time);
  let sortedObstacles = obstacles.sort((a, b) => a._time - b._time);
  let sortedEvents = events.sort((a, b) => a._time - b._time);

  if (meta.version === 2) {
    contents = {
      _version: '2.0.0',
      // BPM changes not yet supported.
      _BPMChanges: [],
      _events: sortedEvents,
      _notes: sortedNotes,
      _obstacles: sortedObstacles,
      // Bookmarks not yet supported.
      _bookmarks: [],
    };
  } else if (meta.version === 1) {
    contents = {
      _version: '1.5.0',
      _beatsPerMinute: Number(bpm),
      _beatsPerBar: 16,
      _noteJumpSpeed: Number(noteJumpSpeed),
      _shuffle: Number(swing || 0),
      _shufflePeriod: Number(swingPeriod || 0.5),
      _events: sortedEvents,
      _notes: sortedNotes,
      _obstacles: sortedObstacles,
    };
  } else {
    throw new Error('unrecognized version: ' + meta.version);
  }

  return JSON.stringify(contents, null, 2);
}

export function createBeatmapContentsFromState(state) {
  const song = getSelectedSong(state);
  const notes = getNotes(state);
  const events = convertEventsToExportableJson(getAllEventsAsArray(state));
  const obstacles = convertObstaclesToExportableJson(getObstacles(state));

  const shiftedNotes = shiftEntitiesByOffset(notes, song.offset, song.bpm);
  const shiftedEvents = shiftEntitiesByOffset(events, song.offset, song.bpm);
  const shiftedObstacles = shiftEntitiesByOffset(
    obstacles,
    song.offset,
    song.bpm
  );

  return createBeatmapContents(shiftedNotes, shiftedEvents, shiftedObstacles, {
    version: 2,
  });
}

export const zipFiles = (song, songFile, coverArtFile, version) => {
  return new Promise(async (resolve, reject) => {
    const zip = new JSZip();

    const infoContent = createInfoContent(song, { version });

    if (version === 2) {
      zip.file('song.egg', songFile, { binary: true });
      zip.file('cover.jpg', coverArtFile, { binary: true });
      zip.file('info.dat', infoContent, { binary: false });
    } else {
      zip.file('song.ogg', songFile, { binary: true });
      zip.file('cover.jpg', coverArtFile, { binary: true });
      zip.file('info.json', infoContent, { binary: false });
    }

    const difficultyContents = await Promise.all(
      Object.keys(song.difficultiesById).map(difficulty =>
        getFile(getFilenameForThing(song.id, 'beatmap', { difficulty })).then(
          fileContents => ({
            difficulty,
            fileContents,
          })
        )
      )
    );

    difficultyContents.forEach(({ difficulty, fileContents }) => {
      if (version === 2) {
        zip.file(`${difficulty}.dat`, fileContents, { binary: false });
      } else {
        // Our files are stored on disk as v2, since this is the modern actually-
        // used format.

        // I also need to save the v1 difficulties so that folks can edit their
        // map in other mapping software, and this is annoying because it
        // requires totally different info.
        const beatmapData = JSON.parse(fileContents);

        const legacyFileContents = createBeatmapContents(
          beatmapData._notes,
          beatmapData._events,
          beatmapData._obstacles,
          { version: 1 },
          song.bpm,
          song.difficultiesById[difficulty].noteJumpSpeed,
          song.swingAmount,
          song.swingPeriod
        );
        zip.file(`${difficulty}.json`, legacyFileContents, { binary: false });
      }
    });

    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      const filename =
        version === 1 ? `${song.id}.legacy.zip` : `${song.id}.zip`;
      saveAs(blob, filename);

      resolve();
    });
  });
};

// If the user uploads a legacy song, we first need to convert it to our
// modern file format. To make life simpler, this method creates a new ZIP
// as if this is the work that the user selected, except its contents are in
// v2 format.
export const convertLegacyArchive = async archive => {
  const zip = new JSZip();

  const infoDatString = await archive.files['info.json'].async('string');
  const infoDatJson = JSON.parse(infoDatString);

  if (infoDatJson.difficultyLevels.length === 0) {
    throw new Error(
      "This song has no difficulty levels. Because it's in the legacy format, this means we cannot determine critical information about the song."
    );
  }

  const coverImageFile = await archive.files[infoDatJson.coverImagePath].async(
    'blob'
  );
  // TODO: Support PNG?
  zip.file('cover.jpg', coverImageFile, { binary: true });

  const { audioPath, offset } = infoDatJson.difficultyLevels[0];
  const songFile = await archive.files[audioPath].async('blob');
  zip.file('song.egg', songFile, { binary: true });

  const bpm = infoDatJson.beatsPerMinute;

  // Create new difficulty files (eg. Expert.dat)
  const loadedDifficultyFiles = await Promise.all(
    infoDatJson.difficultyLevels.map(async level => {
      const fileContents = await archive.files[level.jsonPath].async('string');
      const fileJson = JSON.parse(fileContents);

      const newFileContents = createBeatmapContents(
        fileJson._notes,
        fileJson._events,
        fileJson._obstacles,
        { version: 2 }
      );

      zip.file(`${level.difficulty}.dat`, newFileContents, { binary: false });

      return {
        id: level.difficulty,
        noteJumpSpeed: fileJson._noteJumpSpeed,
        startBeatOffset: 0,
      };
    })
  );

  // Finally, create our new info.dat, and zip it up.
  const difficultiesById = loadedDifficultyFiles.reduce((acc, level) => {
    return {
      ...acc,
      [level.id]: level,
    };
  }, {});

  const fakeSong = {
    name: infoDatJson.songName,
    subName: infoDatJson.songSubName,
    artistName: infoDatJson.authorName,
    bpm,
    offset,
    previewStartTime: infoDatJson.previewStartTime,
    previewDuration: infoDatJson.previewDuration,
    environment: infoDatJson.environmentName,
    difficultiesById,
  };

  const newInfoContent = createInfoContent(fakeSong, { version: 2 });
  zip.file('info.dat', newInfoContent, { binary: false });

  return zip;
};

export const processImportedMap = async (zipFile, currentSongIds) => {
  // Start by unzipping it
  let archive = await JSZip.loadAsync(zipFile);

  const archiveVersion = getArchiveVersion(archive);

  if (archiveVersion !== 2) {
    archive = await convertLegacyArchive(archive);
  }

  // Zipped contents are always treated as binary. We need to convert the
  // info.dat into something readable
  const infoDatString = await archive.files['info.dat'].async('string');
  const infoDatJson = JSON.parse(infoDatString);
  const songId = getSongIdFromName(infoDatJson._songName);

  const songIdAlreadyExists = currentSongIds.some(id => id === songId);
  if (songIdAlreadyExists) {
    const shouldOverwrite = window.confirm(
      'This song appears to be a duplicate. Would you like to overwrite your existing song?'
    );

    if (!shouldOverwrite) {
      throw new Error('Sorry, you already have a song by this name');
    }
  }

  // Save the info.dat (Not 100% sure that this is necessary, but better to
  // have and not need)
  const infoFilename = getFilenameForThing(songId, 'info');
  await saveFile(infoFilename, infoDatString);

  // Save the assets - cover art and song file - to our local store
  const uncompressedSongFile = await archive.files[
    infoDatJson._songFilename
  ].async('blob');
  const uncompressedCoverArtFile = await archive.files[
    infoDatJson._coverImageFilename
  ].async('blob');

  // TODO: I could parallelize these two processes if I felt like it
  const [songFilename, songFile] = await saveSongFile(
    songId,
    uncompressedSongFile
  );
  const [coverArtFilename, coverArtFile] = await saveCoverArtFromBlob(
    songId,
    uncompressedCoverArtFile,
    infoDatJson._coverImageFilename
  );

  // Tackle the difficulties and their entities (notes, obstacles, events).
  // We won't load any of them into redux; instead we'll write it all to
  // disk using our local persistence layer, so that it can be loaded like any
  // other song from the list.
  //
  // For now, we only support 'standard' characteristics (no lightshow or
  // custom game modes)
  const beatmapSet = infoDatJson._difficultyBeatmapSets.find(
    set => set._beatmapCharacteristicName === 'Standard'
  );

  const difficultyFiles = await Promise.all(
    beatmapSet._difficultyBeatmaps.map(beatmap => {
      return archive.files[beatmap._beatmapFilename]
        .async('string')
        .then(fileContents => {
          // TODO: Should I do any cleanup, to verify that the data is legic?

          const beatmapFilename = getFilenameForThing(songId, 'beatmap', {
            difficulty: beatmap._difficulty,
          });

          // Save the file to disk
          return saveFile(beatmapFilename, fileContents).then(() => {
            return {
              id: beatmap._difficulty,
              noteJumpSpeed: beatmap._noteJumpMovementSpeed,
              startBeatOffset: beatmap._noteJumpStartBeatOffset,
              data: JSON.parse(fileContents),
            };
          });
        });
    })
  );

  const difficultiesById = difficultyFiles.reduce(
    (acc, { id, noteJumpSpeed, startBeatOffset }) => {
      return {
        ...acc,
        [id]: {
          id,
          noteJumpSpeed,
          startBeatOffset,
        },
      };
    },
    {}
  );

  let realOffset = 0;
  try {
    realOffset =
      infoDatJson._difficultyBeatmapSets[0]._difficultyBeatmaps[0]._customData
        ._editorOffset || 0;
  } catch (e) {}

  return {
    songId,
    songFile,
    songFilename,
    coverArtFile,
    coverArtFilename,
    name: infoDatJson._songName,
    subName: infoDatJson._songSubName,
    artistName: infoDatJson._songAuthorName,
    mapAuthorName: infoDatJson._levelAuthorName,
    bpm: infoDatJson._beatsPerMinute,
    offset: realOffset,
    swingAmount: infoDatJson._shuffle,
    swingPeriod: infoDatJson._shufflePeriod,
    previewStartTime: infoDatJson._previewStartTime,
    previewDuration: infoDatJson._previewDuration,
    environment: infoDatJson._environmentName,
    difficultiesById,
  };
};

export const saveEventsToAllDifficulties = state => {
  const song = getSelectedSong(state);
  const difficulties = getSelectedSongDifficultyIds(state);

  const events = convertEventsToExportableJson(getAllEventsAsArray(state));
  const shiftedEvents = shiftEntitiesByOffset(events, song.offset, song.bpm);

  return Promise.all(
    difficulties.map(
      difficulty =>
        new Promise((resolve, reject) => {
          const beatmapFilename = getFilenameForThing(song.id, 'beatmap', {
            difficulty,
          });

          getFile(beatmapFilename)
            .then(fileContents => {
              const data = JSON.parse(fileContents);
              data._events = shiftedEvents;

              return saveFile(beatmapFilename, JSON.stringify(data));
            })
            .then(data => {
              resolve(data);
            });
        })
    )
  );
};
