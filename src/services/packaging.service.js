/**
 * This service zips up the current state, to let the user download it.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import formatDate from 'date-fns/format';
import get from 'lodash.get';

import {
  saveFile,
  getFile,
  getFilenameForThing,
  saveSongFile,
  saveCoverArtFromBlob,
} from './file.service';
import { getSongIdFromName, sortDifficultyIds } from '../helpers/song.helpers';
import { convertNotesToMappingExtensions } from '../helpers/notes.helpers';
import { convertEventsToExportableJson } from '../helpers/events.helpers';
import { convertObstaclesToExportableJson } from '../helpers/obstacles.helpers';
import { convertBookmarksToExportableJson } from '../helpers/bookmarks.helpers';
import { formatColorForMods } from '../helpers/colors.helpers';
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
  getFileFromArchive,
  deriveDefaultModSettingsFromBeatmap,
} from './packaging.service.nitty-gritty';
import { getSortedBookmarksArray } from '../reducers/bookmarks.reducer';

const LIGHTSHOW_FILENAME = 'EasyLightshow.dat';

export function createInfoContent(song, meta = { version: 2 }) {
  const difficultyIds = sortDifficultyIds(Object.keys(song.difficultiesById));
  const difficulties = difficultyIds.map(id => song.difficultiesById[id]);

  // We need to make sure we store numbers as numbers.
  // This SHOULD be done at a higher level, but may not be.
  const bpm = Number(song.bpm);
  const offset = Number(song.offset);

  // Has this song enabled any mod support?
  let requirements = [];
  const mappingExtensionsEnabled = !!get(
    song,
    'modSettings.mappingExtensions.isEnabled'
  );
  if (mappingExtensionsEnabled) {
    requirements.push('Mapping Extensions');
  }

  const editorSettings = {
    enabledFastWalls: song.enabledFastWalls,
    modSettings: song.modSettings,
  };

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
    const beatmapSets = [
      {
        _beatmapCharacteristicName: 'Standard',
        _difficultyBeatmaps: difficulties.map(difficulty => {
          const difficultyData = {
            _difficulty: difficulty.id,
            _difficultyRank: getDifficultyRankForDifficulty(difficulty),
            _beatmapFilename: `${difficulty.id}.dat`,
            _noteJumpMovementSpeed: difficulty.noteJumpSpeed,
            _noteJumpStartBeatOffset: difficulty.startBeatOffset,
            _customData: {
              _editorOffset: offset,
              _requirements: requirements,
            },
          };

          if (difficulty.customLabel) {
            difficultyData._customData._difficultyLabel =
              difficulty.customLabel;
          }

          return difficultyData;
        }),
      },
    ];

    if (song.enabledLightshow) {
      beatmapSets.push({
        _beatmapCharacteristicName: 'Lightshow',
        _difficultyBeatmaps: [
          {
            _difficulty: 'Easy',
            _difficultyRank: 1,
            _beatmapFilename: 'EasyLightshow.dat',
            _noteJumpMovementSpeed: 16,
            _noteJumpStartBeatOffset: 0,
            _customData: {
              _editorOffset: offset,
              _requirements: requirements,
              _difficultyLabel: 'Lightshow',
            },
          },
        ],
      });
    }

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
        _editor: 'beatmapper',
        _editorSettings: editorSettings,
      },
      _difficultyBeatmapSets: beatmapSets,
    };

    // If the user has enabled custom colors, we need to include that as well
    const enabledCustomColors = get(song, 'modSettings.customColors.isEnabled');
    if (enabledCustomColors) {
      const colors = song.modSettings.customColors;

      const colorData = {
        _colorLeft: formatColorForMods(
          'colorLeft',
          colors.colorLeft,
          colors.colorLeftOverdrive
        ),
        _colorRight: formatColorForMods(
          'colorRight',
          colors.colorRight,
          colors.colorRightOverdrive
        ),
        _envColorLeft: formatColorForMods(
          'envColorLeft',
          colors.envColorLeft,
          colors.envColorLeftOverdrive
        ),
        _envColorRight: formatColorForMods(
          'envColorRight',
          colors.envColorRight,
          colors.envColorRightOverdrive
        ),
        _obstacleColor: formatColorForMods(
          'obstacleColor',
          colors.obstacleColor,
          colors.obstacleColorOverdrive
        ),
      };

      contents._difficultyBeatmapSets.forEach(set => {
        set._difficultyBeatmaps.forEach(difficulty => {
          difficulty._customData = {
            ...difficulty._customData,
            ...colorData,
          };
        });
      });
    }
  } else {
    throw new Error('Unrecognized version: ' + meta.version);
  }

  return JSON.stringify(contents, null, 2);
}

/**
 * This method takes JSON-formatted entities and produces a JSON string to be
 * saved to the persistence system as a file. This is for the beatmap itself,
 * eg. 'Expert.dat'.
 */
export function createBeatmapContents(
  { notes = [], obstacles = [], events = [], bookmarks = [] },
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
  const sortByTime = (a, b) => a._time - b._time;
  const sortByTimeAndPosition = (a, b) => {
    if (a._time === b._time && a._lineLayer === b._lineLayer) {
      return a._lineIndex - b._lineIndex;
    }

    if (a._time === b._time) {
      return a._lineLayer - b._lineLayer;
    }

    return sortByTime(a, b);
  };

  let sortedNotes = [...notes].sort(sortByTimeAndPosition);
  let sortedObstacles = [...obstacles].sort(sortByTime);
  let sortedEvents = [...events].sort(sortByTime);

  // Annoyingly sometimes we can end up with floating-point issues on
  // lineIndex and lineLayer. Usually I deal with this in the helpers, but
  // notes don't have a helper yet.
  // Also, now that 'cutDirection' can be 360 degrees, it also needs to be
  // rounded
  sortedNotes = sortedNotes.map(note => ({
    ...note,
    _lineIndex: Math.round(note._lineIndex),
    _lineLayer: Math.round(note._lineLayer),
    _cutDirection: Math.round(note._cutDirection),
  }));

  // Remove 'selected' property
  const removeSelected = entity => {
    const copy = { ...entity };
    delete copy.selected;

    return copy;
  };

  sortedNotes = sortedNotes.map(removeSelected);
  sortedObstacles = sortedObstacles.map(removeSelected);
  sortedEvents = sortedEvents.map(removeSelected);

  if (meta.version === 2) {
    contents = {
      _version: '2.0.0',
      _events: sortedEvents,
      _notes: sortedNotes,
      _obstacles: sortedObstacles,
      _customData: {
        _bookmarks: bookmarks,
      },
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

export function createBeatmapContentsFromState(state, song) {
  const notes = getNotes(state);
  const events = convertEventsToExportableJson(getAllEventsAsArray(state));
  const obstacles = convertObstaclesToExportableJson(getObstacles(state));
  const bookmarks = convertBookmarksToExportableJson(
    getSortedBookmarksArray(state)
  );

  // It's important that notes are sorted by their _time property primarily,
  // and then by _lineLayer secondarily.

  const shiftedNotes = shiftEntitiesByOffset(notes, song.offset, song.bpm);
  const shiftedEvents = shiftEntitiesByOffset(events, song.offset, song.bpm);
  const shiftedObstacles = shiftEntitiesByOffset(
    obstacles,
    song.offset,
    song.bpm
  );

  // Deselect all entities before saving, we don't want to persist that info.
  const deselect = entity => ({
    ...entity,
    selected: false,
  });
  let deselectedNotes = shiftedNotes.map(deselect);
  let deselectedObstacles = shiftedObstacles.map(deselect);
  let deselectedEvents = shiftedEvents.map(deselect);

  // If the user has mapping extensions enabled, multiply the notes to sit in
  // the 1000+ range.
  if (get(song, 'modSettings.mappingExtensions.isEnabled')) {
    deselectedNotes = convertNotesToMappingExtensions(deselectedNotes);
  }

  return createBeatmapContents(
    {
      notes: deselectedNotes,
      obstacles: deselectedObstacles,
      events: deselectedEvents,
      bookmarks,
    },
    {
      version: 2,
    }
  );
}

export const zipFiles = (song, songFile, coverArtFile, version) => {
  return new Promise(async resolve => {
    const zip = new JSZip();

    const infoContent = createInfoContent(song, { version });

    if (version === 2) {
      zip.file('song.egg', songFile, { binary: true });
      zip.file('cover.jpg', coverArtFile, { binary: true });
      zip.file('Info.dat', infoContent, { binary: false });
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
          {
            notes: beatmapData._notes,
            obstacles: beatmapData._obstacles,
            events: beatmapData._events,
            bookmarks: beatmapData._bookmarks,
          },
          { version: 1 },
          song.bpm,
          song.difficultiesById[difficulty].noteJumpSpeed,
          song.swingAmount,
          song.swingPeriod
        );
        zip.file(`${difficulty}.json`, legacyFileContents, { binary: false });
      }
    });

    if (version === 2 && song.enabledLightshow) {
      // We want to grab the lights (events). Any beatmap will do
      const { fileContents } = difficultyContents[0];
      const events = JSON.parse(fileContents)._events;

      const lightshowFileContents = createBeatmapContents(
        { events },
        { version: 2 }
      );

      zip.file(LIGHTSHOW_FILENAME, lightshowFileContents, { binary: false });
    }

    zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      }
    }).then(function (blob) {
      const timestamp = formatDate(new Date(), 'YYYYMMDDTHHmm');
      const filename =
        version === 1
          ? `${song.id}_${timestamp}.legacy.zip`
          : `${song.id}_${timestamp}.zip`;
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

  const infoDatString = await getFileFromArchive(archive, 'info.json').async(
    'string'
  );
  const infoDatJson = JSON.parse(infoDatString);

  if (infoDatJson.difficultyLevels.length === 0) {
    throw new Error(
      "This song has no difficulty levels. Because it's in the legacy format, this means we cannot determine critical information about the song."
    );
  }

  const coverImageFile = await getFileFromArchive(
    archive,
    infoDatJson.coverImagePath
  ).async('blob');
  // TODO: Support PNG?
  zip.file('cover.jpg', coverImageFile, { binary: true });

  const { audioPath, offset } = infoDatJson.difficultyLevels[0];
  const songFile = await getFileFromArchive(archive, audioPath).async('blob');
  zip.file('song.egg', songFile, { binary: true });

  const bpm = infoDatJson.beatsPerMinute;

  // Create new difficulty files (eg. Expert.dat)
  const loadedDifficultyFiles = await Promise.all(
    infoDatJson.difficultyLevels.map(async level => {
      const fileContents = await getFileFromArchive(
        archive,
        level.jsonPath
      ).async('string');
      const fileJson = JSON.parse(fileContents);

      const newFileContents = createBeatmapContents(
        {
          notes: fileJson._notes,
          obstacles: fileJson._obstacles,
          events: fileJson._events,
          bookmarks: fileJson._bookmarks,
        },
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

  // Finally, create our new Info.dat, and zip it up.
  const difficultiesById = loadedDifficultyFiles.reduce((acc, level) => {
    return {
      ...acc,
      [level.id]: level,
    };
  }, {});

  const fakeSong = {
    name: infoDatJson.songName,
    artistName: infoDatJson.songSubName,
    mapAuthorName: infoDatJson.authorName,
    bpm,
    offset,
    previewStartTime: infoDatJson.previewStartTime,
    previewDuration: infoDatJson.previewDuration,
    environment: infoDatJson.environmentName,
    difficultiesById,
  };

  const newInfoContent = createInfoContent(fakeSong, { version: 2 });
  zip.file('Info.dat', newInfoContent, { binary: false });

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
  // Info.dat into something readable
  const infoDatString = await getFileFromArchive(archive, 'Info.dat').async(
    'string'
  );
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

  // Save the Info.dat (Not 100% sure that this is necessary, but better to
  // have and not need)
  const infoFilename = getFilenameForThing(songId, 'info');
  await saveFile(infoFilename, infoDatString);

  // Save the assets - cover art and song file - to our local store
  const uncompressedSongFile = await getFileFromArchive(
    archive,
    infoDatJson._songFilename
  ).async('blob');
  const uncompressedCoverArtFile = await getFileFromArchive(
    archive,
    infoDatJson._coverImageFilename
  ).async('blob');

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
  // While we can export lightshow maps, we don't actually load them.
  const beatmapSet = infoDatJson._difficultyBeatmapSets.find(
    set => set._beatmapCharacteristicName === 'Standard'
  );

  // We do check if a lightshow exists only so we can store that setting, to
  // include lightmaps when exporting
  const enabledLightshow = infoDatJson._difficultyBeatmapSets.some(
    set => set._beatmapCharacteristicName === 'Lightshow'
  );

  const difficultyFiles = await Promise.all(
    beatmapSet._difficultyBeatmaps.map(beatmap => {
      return getFileFromArchive(archive, beatmap._beatmapFilename)
        .async('string')
        .then(fileContents => {
          // TODO: Should I do any cleanup, to verify that the data is legic?

          const beatmapFilename = getFilenameForThing(songId, 'beatmap', {
            difficulty: beatmap._difficulty,
          });

          // Save the file to disk
          return saveFile(beatmapFilename, fileContents).then(() => {
            const beatmapData = {
              id: beatmap._difficulty,
              noteJumpSpeed: beatmap._noteJumpMovementSpeed,
              startBeatOffset: beatmap._noteJumpStartBeatOffset,

              // TODO: Am I actually using `data` for anything?
              // I don't think I am
              data: JSON.parse(fileContents),
            };

            if (beatmap._customData && beatmap._customData._difficultyLabel) {
              beatmapData.customLabel = beatmap._customData._difficultyLabel;
            }

            return beatmapData;
          });
        });
    })
  );

  const difficultiesById = difficultyFiles.reduce(
    (acc, { id, noteJumpSpeed, startBeatOffset, customLabel, ...rest }) => {
      return {
        ...acc,
        [id]: {
          id,
          noteJumpSpeed,
          startBeatOffset,
          customLabel: customLabel || '',
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
  } catch (e) { }

  const wasCreatedInBeatmapper =
    get(infoDatJson, '_customData._editor') === 'beatmapper';

  const persistedData = wasCreatedInBeatmapper
    ? infoDatJson._customData._editorSettings
    : {};

  let modSettings =
    persistedData.modSettings ||
    deriveDefaultModSettingsFromBeatmap(beatmapSet);

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
    ...persistedData,
    modSettings,
    enabledLightshow,
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
        new Promise(resolve => {
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
