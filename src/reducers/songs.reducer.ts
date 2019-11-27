import produce from 'immer';
import { createSelector } from 'reselect';
import get from 'lodash.get';

import { sortDifficultyIds } from '../helpers/song.helpers';
import { DEFAULT_RED, DEFAULT_BLUE } from '../helpers/colors.helpers';
import {
  DEFAULT_GRID,
  DEFAULT_COL_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from '../helpers/grid.helpers';
import { isEmpty } from '../utils';

interface Difficulty {
  id: string;
  noteJumpSpeed: number;
  startBeatOffset: number;
  customLabel?: string;
}

interface ModSettings {
  mappingExtensions: {
    isEnabled: boolean;
    numRows: number;
    numCols: number;
    colWidth: number;
    rowHeight: number;
  };
  customColors: {
    isEnabled: boolean;
    colorLeft: string;
    colorLeftOverdrive: number;
    colorRight: string;
    colorRightOverdrive: number;
    envColorLeft: string;
    envColorLeftOverdrive: number;
    envColorRight: string;
    envColorRightOverdrive: number;
    obstacleColor: string;
    obstacleColorOverdrive: number;
  };
}

interface Song {
  id: string;
  name: string;
  subName?: string;
  artistName: string;
  mapAuthorName?: string;
  bpm: number;
  offset: number;
  swingAmount?: number;
  swingPeriod?: number;
  previewStartTime: number;
  previewDuration: number;
  environment:
    | 'DefaultEnvironment'
    | 'BigMirrorEnvironment'
    | 'TriangleEnvironment'
    | 'NiceEnvironment'
    | 'DragonsEnvironment';
  songFilename: string;
  coverArtFilename: string;
  difficultiesById: { [key: string]: Difficulty };
  selectedDifficulty?: Difficulty;
  createdAt: number;
  lastOpenedAt: number;
  demo?: boolean;
  modSettings: ModSettings;
  enabledFastWalls?: boolean;
  enabledLightshow?: boolean;
}

interface State {
  byId: { [key: string]: Song };
  selectedId: string | null;
  processingImport: boolean;
}

const initialState = {
  byId: {},
  selectedId: null,
  processingImport: false,
};

const DEFAULT_NOTE_JUMP_SPEEDS = {
  Easy: 10,
  Normal: 10,
  Hard: 12,
  Expert: 15,
  ExpertPlus: 18,
};

const DEFAULT_MOD_SETTINGS = {
  customColors: {
    isEnabled: false,
    colorLeft: DEFAULT_RED,
    colorLeftOverdrive: 0,
    colorRight: DEFAULT_BLUE,
    colorRightOverdrive: 0,
    envColorLeft: DEFAULT_RED,
    envColorLeftOverdrive: 0,
    envColorRight: DEFAULT_BLUE,
    envColorRightOverdrive: 0,
    obstacleColor: DEFAULT_RED,
    obstacleColorOverdrive: 0,
  },
  mappingExtensions: {
    isEnabled: false,
    ...DEFAULT_GRID,
  },
};

export default function songsReducer(state: State = initialState, action: any) {
  switch (action.type) {
    case 'START_LOADING_SONG': {
      const { songId, difficulty } = action;

      return produce(state, (draftState: State) => {
        draftState.selectedId = songId;
        draftState.byId[songId].selectedDifficulty = difficulty;
      });
    }

    case 'FINISH_LOADING_SONG': {
      const { song, lastOpenedAt } = action;

      return produce(state, (draftState: State) => {
        const draftSong = draftState.byId[song.id];

        draftSong.lastOpenedAt = lastOpenedAt;
        draftSong.modSettings = draftSong.modSettings || {};
      });
    }

    case 'LEAVE_EDITOR': {
      return {
        ...state,
        selectedId: null,
      };
    }

    case 'START_IMPORTING_SONG': {
      return {
        ...state,
        processingImport: true,
      };
    }

    case 'CANCEL_IMPORTING_SONG': {
      return {
        ...state,
        processingImport: false,
      };
    }

    case 'CREATE_NEW_SONG': {
      const {
        coverArtFilename,
        songFilename,
        songId,
        name,
        subName,
        artistName,
        bpm,
        offset,
        selectedDifficulty,
        mapAuthorName,
        createdAt,
        lastOpenedAt,
      } = action;

      return produce(state, (draftState: State) => {
        draftState.selectedId = songId;
        draftState.byId[songId] = {
          id: songId,
          name,
          subName,
          artistName,
          bpm,
          offset,
          previewStartTime: 12,
          previewDuration: 10,
          songFilename,
          coverArtFilename,
          environment: 'DefaultEnvironment',
          mapAuthorName,
          createdAt,
          lastOpenedAt,
          selectedDifficulty,
          difficultiesById: {
            [selectedDifficulty]: {
              id: selectedDifficulty,
              // @ts-ignore
              noteJumpSpeed: DEFAULT_NOTE_JUMP_SPEEDS[selectedDifficulty],
              startBeatOffset: 0,
              customLabel: '',
            },
          },
          modSettings: DEFAULT_MOD_SETTINGS,
        };
      });
    }

    case 'IMPORT_EXISTING_SONG': {
      const {
        createdAt,
        lastOpenedAt,
        songData: {
          songId,
          songFilename,
          coverArtFilename,
          name,
          subName,
          artistName,
          mapAuthorName,
          bpm,
          offset,
          swingAmount,
          swingPeriod,
          previewStartTime,
          previewDuration,
          environment,
          difficultiesById,
          demo,
          modSettings = {},
          enabledFastWalls = false,
          enabledLightshow = false,
        },
      } = action;

      // @ts-ignore
      const selectedDifficulty: Difficulty = Object.keys(difficultiesById)[0];

      return produce(state, (draftState: State) => {
        draftState.processingImport = false;
        draftState.byId[songId] = {
          id: songId,
          name,
          subName,
          artistName,
          mapAuthorName,
          bpm,
          offset,
          swingAmount,
          swingPeriod,
          previewStartTime,
          previewDuration,
          songFilename,
          coverArtFilename,
          environment,
          selectedDifficulty,
          difficultiesById,
          createdAt,
          lastOpenedAt,
          demo,
          modSettings,
          enabledFastWalls,
          enabledLightshow,
        };
      });
    }

    case 'UPDATE_SONG_DETAILS': {
      const { type, songId, ...fieldsToUpdate } = action;

      return produce(state, (draftState: State) => {
        draftState.byId[songId] = {
          ...draftState.byId[songId],
          ...fieldsToUpdate,
        };
      });
    }

    case 'CREATE_DIFFICULTY': {
      const { difficulty } = action;

      return produce(state, (draftState: State) => {
        const selectedSongId = state.selectedId;

        if (!selectedSongId) {
          return state;
        }

        const song = draftState.byId[selectedSongId];

        song.selectedDifficulty = difficulty;
        song.difficultiesById[difficulty] = {
          id: difficulty,
          // @ts-ignore
          noteJumpSpeed: DEFAULT_NOTE_JUMP_SPEEDS[difficulty],
          startBeatOffset: 0,
          customLabel: '',
        };
      });
    }

    case 'COPY_DIFFICULTY': {
      const { songId, fromDifficultyId, toDifficultyId } = action;

      return produce(state, (draftState: State) => {
        const song = draftState.byId[songId];

        const newDifficultyObj = {
          ...song.difficultiesById[fromDifficultyId],
          id: toDifficultyId,
        };

        song.selectedDifficulty = toDifficultyId;
        song.difficultiesById[toDifficultyId] = newDifficultyObj;
      });
    }

    case 'CHANGE_SELECTED_DIFFICULTY': {
      const { songId, difficulty } = action;

      return produce(state, (draftState: State) => {
        const song = draftState.byId[songId];

        song.selectedDifficulty = difficulty;
      });
    }

    case 'DELETE_BEATMAP': {
      const { songId, difficulty } = action;

      return produce(state, (draftState: State) => {
        delete draftState.byId[songId].difficultiesById[difficulty];
      });
    }

    case 'UPDATE_BEATMAP_METADATA': {
      const {
        songId,
        difficulty,
        noteJumpSpeed,
        startBeatOffset,
        customLabel,
      } = action;

      return produce(state, (draftState: State) => {
        const currentBeatmapDifficulty =
          draftState.byId[songId].difficultiesById[difficulty];

        currentBeatmapDifficulty.noteJumpSpeed = noteJumpSpeed;
        currentBeatmapDifficulty.startBeatOffset = startBeatOffset;
        currentBeatmapDifficulty.customLabel = customLabel;
      });
    }

    case 'DELETE_SONG': {
      const { songId } = action;

      return produce(state, (draftState: State) => {
        delete draftState.byId[songId];
      });
    }

    case 'TOGGLE_MOD_FOR_SONG': {
      const { mod } = action;

      return produce(state, (draftState: any) => {
        // Should-be-impossible edge-case where no selected song exists
        if (!draftState.selectedId || !draftState.byId[draftState.selectedId]) {
          return;
        }

        const song = draftState.byId[draftState.selectedId];

        // For a brief moment, modSettings was being set to an empty object,
        // before the children were required. Update that now, if so.
        if (!song.modSettings || isEmpty(song.modSettings)) {
          song.modSettings = DEFAULT_MOD_SETTINGS;
        }

        // Also for a brief moment, modSettings didn't always have properties
        // for each mod
        if (!song.modSettings[mod]) {
          // @ts-ignore
          song.modSettings[mod] = DEFAULT_MOD_SETTINGS[mod];
        }

        const isModEnabled = get(song, `modSettings.${mod}.isEnabled`);

        song.modSettings[mod].isEnabled = !isModEnabled;
      });
    }

    case 'UPDATE_MOD_COLOR': {
      const { element, color } = action;

      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        if (!song.modSettings.customColors) {
          song.modSettings.customColors = DEFAULT_MOD_SETTINGS.customColors;
        }

        // @ts-ignore
        song.modSettings.customColors[element] = color;
      });
    }

    case 'UPDATE_MOD_COLOR_OVERDRIVE': {
      const { element, overdrive } = action;

      const elementOverdriveKey = `${element}Overdrive`;

      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        if (!song.modSettings.customColors) {
          song.modSettings.customColors = DEFAULT_MOD_SETTINGS.customColors;
        }

        // @ts-ignore
        song.modSettings.customColors[elementOverdriveKey] = overdrive;
      });
    }

    case 'UPDATE_GRID': {
      const { numRows, numCols, colWidth, rowHeight } = action;

      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        if (!song.modSettings || !song.modSettings.mappingExtensions) {
          song.modSettings.mappingExtensions =
            DEFAULT_MOD_SETTINGS.mappingExtensions;
        }

        song.modSettings.mappingExtensions.numRows = numRows;
        song.modSettings.mappingExtensions.numCols = numCols;
        song.modSettings.mappingExtensions.colWidth = colWidth;
        song.modSettings.mappingExtensions.rowHeight = rowHeight;
      });
    }

    case 'RESET_GRID': {
      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        song.modSettings.mappingExtensions = {
          ...song.modSettings.mappingExtensions,
          ...DEFAULT_GRID,
        };
      });
    }

    case 'LOAD_GRID_PRESET': {
      const { grid } = action;

      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        song.modSettings.mappingExtensions = {
          ...song.modSettings.mappingExtensions,
          ...grid,
        };
      });
    }

    case 'TOGGLE_PROPERTY_FOR_SELECTED_SONG': {
      const { property } = action;

      return produce(state, (draftState: State) => {
        const song = grabSelectedSong(draftState);

        if (!song) {
          return;
        }

        // @ts-ignore
        song[property] = !song[property];
      });
    }

    default:
      return state;
  }
}

//
//
//// HELPERS
//
const grabSelectedSong = (state: State) => {
  if (!state.selectedId) {
    return undefined;
  }

  return state.byId[state.selectedId];
};

//
//
//// SELECTORS
//
const getById = (state: any) => state.songs.byId;

export const getAllSongs = (state: any): Array<Song> => {
  return Object.values(getById(state));
};
export const getAllSongIds = (state: any) => {
  return Object.keys(getById(state));
};
export const getAllSongsChronologically = (state: any) => {
  return getAllSongs(state).sort((a: Song, b: Song) => {
    return a.lastOpenedAt > b.lastOpenedAt ? -1 : 1;
  });
};

export const getProcessingImport = (state: any) => state.songs.processingImport;

export const getSongById = (state: any, songId: string) => {
  const byId = getById(state);
  return byId[songId];
};

export const getSelectedSongId = (state: any) => {
  return state.songs.selectedId;
};

export const getSelectedSong = (state: any) => {
  const byId = getById(state);
  return byId[getSelectedSongId(state)];
};

export const getSelectedSongDifficultyIds = createSelector(
  getSelectedSong,
  (selectedSong: any) => {
    /**
     * This selector comes with the added bonus that difficulties are sorted
     * (easy to expert+)
     */
    const ids = Object.keys(selectedSong.difficultiesById);

    // @ts-ignore
    return sortDifficultyIds(ids);
  }
);

export const getDemoSong = (state: any) => {
  return getAllSongs(state).find(song => song.demo);
};

export const getGridSize = (state: any) => {
  const song = getSelectedSong(state);

  const mappingExtensions = get(song, 'modSettings.mappingExtensions');

  // In legacy states, `mappingExtensions` was a boolean, and it was possible
  // to not have the key at all.
  // Also, if the user has set a custom grid but then disabled the extension,
  // we should
  const isLegacy = typeof mappingExtensions === 'boolean' || !mappingExtensions;
  const isDisabled = get(mappingExtensions, 'isEnabled') === false;
  if (isLegacy || isDisabled) {
    return DEFAULT_GRID;
  }

  return {
    numRows: mappingExtensions.numRows,
    numCols: mappingExtensions.numCols,
    colWidth: mappingExtensions.colWidth || DEFAULT_COL_WIDTH,
    rowHeight: mappingExtensions.rowHeight || DEFAULT_ROW_HEIGHT,
  };
};

type EnabledMods = {
  mappingExtensions: boolean;
  customColors: boolean;
};

export const getEnabledMods = createSelector(
  getSelectedSong,
  (song): EnabledMods => {
    return {
      mappingExtensions: !!get(song, 'modSettings.mappingExtensions.isEnabled'),
      customColors: !!get(song, 'modSettings.customColors.isEnabled'),
    };
  }
);

export const getEnabledFastWalls = createSelector(
  getSelectedSong,
  song => {
    return song.enabledFastWalls;
  }
);
export const getEnabledLightshow = createSelector(
  getSelectedSong,
  song => {
    return song.enabledLightshow;
  }
);

export const getCustomColors = createSelector(
  getSelectedSong,
  song => {
    let colors = song.modSettings.customColors;

    if (!colors) {
      return DEFAULT_MOD_SETTINGS.customColors;
    }

    return {
      ...DEFAULT_MOD_SETTINGS.customColors,
      ...colors,
    };
  }
);

export const getMappingMode = createSelector(
  getEnabledMods,
  enabledMods => {
    return enabledMods.mappingExtensions ? 'mapping-extensions' : 'original';
  }
);
