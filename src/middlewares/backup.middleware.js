import { saveBeatmap } from '../services/file.service';
import { createBeatmapContentsFromState } from '../services/packaging.service';
import { getSelectedSong } from '../reducers/songs.reducer';
import { getDifficulty } from '../reducers/editor-entities.reducer';
import autosaveWorker from '../workers/autosave.worker';

// Saving is a significantly expensive operation, and it's one that is done
// very often, so it makes sense to do it in a web worker.
const instance = autosaveWorker();

export default function createBackupMiddleware() {
  return store => next => action => {
    next(action);

    if (action.type === 'REDUX_STORAGE_SAVE') {
      const state = store.getState();

      // For reasons unknown to me, sometimes while on localhost the instance
      // isn't created properly, and lacks a 'save' method :/
      // If it fails, we can save the "normal" way.
      // I _think_ this only seems to happen on localhost.
      try {
        instance.save(state);
      } catch (err) {
        const song = getSelectedSong(state);

        // We only want to autosave when a song is currently selected
        if (!song) {
          return;
        }

        const difficulty = getDifficulty(state);
        const beatmapContents = createBeatmapContentsFromState(state, song);

        saveBeatmap(song.id, difficulty, beatmapContents).catch(err => {
          console.error('Could not run backup for beatmap file', err);
        });
      }
    }
  };
}
