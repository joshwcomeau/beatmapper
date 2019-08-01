import produce from 'immer';

import { sortDifficultyIds } from '../helpers/song.helpers';

interface Difficulty {
  id: string;
  noteJumpSpeed: number;
  startBeatOffset: number;
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
    | 'NiceEnvironment';
  songFilename: string;
  coverArtFilename: string;
  difficultiesById: { [key: string]: Difficulty };
  selectedDifficulty?: Difficulty;
  createdAt: number;
  lastOpenedAt: number;
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

export default function songsReducer(state: State = initialState, action: any) {
  switch (action.type) {
    case 'START_LOADING_SONG': {
      const { songId } = action;

      return {
        ...state,
        selectedId: songId,
      };
    }

    case 'FINISH_LOADING_SONG': {
      const { song, lastOpenedAt } = action;
      return produce(state, (draftState: State) => {
        draftState.byId[song.id].lastOpenedAt = lastOpenedAt;
      });
    }

    case 'START_IMPORTING_SONG': {
      return {
        ...state,
        processingImport: true,
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
          createdAt,
          lastOpenedAt,
          difficultiesById: {
            [selectedDifficulty]: {
              id: selectedDifficulty,
              noteJumpSpeed: 10,
              startBeatOffset: 0,
            },
          },
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
        },
      } = action;

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
          difficultiesById,
          createdAt,
          lastOpenedAt,
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

        draftState.byId[selectedSongId].difficultiesById[difficulty] = {
          id: difficulty,
          noteJumpSpeed: 10,
          startBeatOffset: 0,
        };
      });
    }

    case 'DELETE_BEATMAP': {
      const { songId, difficulty } = action;

      return produce(state, (draftState: State) => {
        delete draftState.byId[songId].difficultiesById[difficulty];
      });
    }

    case 'UPDATE_BEATMAP_METADATA': {
      const { songId, difficulty, noteJumpSpeed, startBeatOffset } = action;

      return produce(state, (draftState: State) => {
        draftState.byId[songId].difficultiesById[
          difficulty
        ].noteJumpSpeed = noteJumpSpeed;
        draftState.byId[songId].difficultiesById[
          difficulty
        ].startBeatOffset = startBeatOffset;
      });
    }

    case 'DELETE_SONG': {
      const { songId } = action;

      return produce(state, (draftState: State) => {
        delete draftState.byId[songId];
      });
    }

    default:
      return state;
  }
}

export const getAllSongs = (state: any): Array<Song> => {
  return Object.values(state.songs.byId);
};
export const getAllSongIds = (state: any) => {
  return Object.keys(state.songs.byId);
};
export const getAllSongsChronologically = (state: any) => {
  return getAllSongs(state).sort((a: Song, b: Song) => {
    return a.lastOpenedAt > b.lastOpenedAt ? -1 : 1;
  });
};

export const getProcessingImport = (state: any) => state.songs.processingImport;

export const getSongById = (state: any, songId: string) =>
  state.songs.byId[songId];

export const getSelectedSongId = (state: any) => {
  return state.songs.selectedId;
};

export const getSelectedSong = (state: any) => {
  return state.songs.byId[getSelectedSongId(state)];
};

export const getSelectedSongDifficultyIds = (state: any) => {
  /**
   * This selector comes with the added bonus that difficulties are sorted
   * (easy to expert+)
   */
  const ids = Object.keys(getSelectedSong(state).difficultiesById);

  // @ts-ignore
  return sortDifficultyIds(ids);
};
