import { getSelectedSong } from '../reducers/songs.reducer';
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
} from '../services/packaging.service';

window.saveFile = saveFile;
window.getFile = getFile;

export default function createPackagingMiddleware() {
  return store => next => async action => {
    if (action.type !== 'DOWNLOAD_MAP_FILES') {
      return next(action);
    }

    const { version } = action;

    // Ok, so I will eventually have other difficulties saved as .dat files.
    // Rather than treat the currently-loaded difficulty separately, I should
    // start by saving the current difficulty to disk, and then I can just load
    // all difficulties from disk.
    const state = store.getState();

    const song = getSelectedSong(state);
    const difficulty = getDifficulty(state);

    const infoContent = createInfoContent(song, { version: 2 });
    const beatmapContent = createBeatmapContentsFromState(state);

    // Persist the info.dat and the currently-edited difficulty.
    await saveInfoDat(song.id, infoContent);
    await saveBeatmap(song.id, difficulty, beatmapContent);

    // Next, I need to fetch all relevant files from disk.
    // TODO: Parallelize this if it takes too long
    const songFile = await getFile(song.songFilename);
    const coverArtFile = await getFile(song.coverArtFilename);

    await zipFiles(song, songFile, coverArtFile, version);
  };
}
