import { getSelectedSong, getSongById } from '../reducers/songs.reducer';
import { getDifficulty } from '../reducers/editor-entities.reducer';
import {
  saveFile,
  getFile,
  saveInfoDat,
  saveBeatmap,
} from '../services/file.service';
import {
  createInfoContent,
  createBeatmapContentsFromState,
  zipFiles,
  saveEventsToAllDifficulties,
} from '../services/packaging.service';

window.saveFile = saveFile;
window.getFile = getFile;

export default function createPackagingMiddleware() {
  return store => next => async action => {
    if (action.type !== 'DOWNLOAD_MAP_FILES') {
      return next(action);
    }

    const { version, songId } = action;

    const state = store.getState();

    const selectedSong = getSelectedSong(state);

    let song = selectedSong;
    if (!selectedSong) {
      if (!songId) {
        throw new Error(
          'Tried to download a song with no supplied songId, and no currently-selected song.'
        );
      }

      song = getSongById(state, songId);
    }

    const infoContent = createInfoContent(song, { version: 2 });
    const beatmapContent = createBeatmapContentsFromState(state, song);

    // IF we have an actively-loaded song, we want to first persist that song
    // so that we download the very latest stuff. Note that we can also download
    // files from the homescreen, so there will be no selected difficulty
    // in this case.
    if (selectedSong) {
      const difficulty = getDifficulty(state);
      // Persist the Info.dat and the currently-edited difficulty.
      await saveInfoDat(song.id, infoContent);
      await saveBeatmap(song.id, difficulty, beatmapContent);

      // We also want to share events between all difficulties.
      // Copy the events currently in state to the non-loaded beatmaps.
      await saveEventsToAllDifficulties(state);
    }

    // Next, I need to fetch all relevant files from disk.
    // TODO: Parallelize this if it takes too long
    const songFile = await getFile(song.songFilename);
    const coverArtFile = await getFile(song.coverArtFilename);

    await zipFiles(song, songFile, coverArtFile, version);
  };
}
