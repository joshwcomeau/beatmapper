/**
 * This middleware manages playback concerns.
 */
import { ActionCreators as ReduxUndoActionCreators } from 'redux-undo';

import {
  finishLoadingSong,
  adjustCursorPosition,
  startPlaying,
  pausePlaying,
  loadBeatmapEntities,
  reloadWaveform,
} from '../actions';
import {
  createHtmlAudioElement,
  snapToNearestBeat,
  convertBeatsToMilliseconds,
  convertMillisecondsToBeats,
} from '../helpers/audio.helpers';
import { convertObstaclesToRedux } from '../helpers/obstacles.helpers';
import {
  convertEventsToRedux,
  convertEventsToExportableJson,
} from '../helpers/events.helpers';
import { convertBookmarksToRedux } from '../helpers/bookmarks.helpers';
import { clamp } from '../utils';
import {
  getFile,
  saveFile,
  deleteFile,
  getBeatmap,
  deleteAllSongFiles,
  getFilenameForThing,
  saveBeatmap,
  saveInfoDat,
} from '../services/file.service';
import Sfx from '../services/sfx.service';
import { getSongById, getSelectedSong } from '../reducers/songs.reducer';
import { getBeatsPerZoomLevel } from '../reducers/editor.reducer';
import { getAllEventsAsArray } from '../reducers/editor-entities.reducer/events-view.reducer';
import { getNotes } from '../reducers/editor-entities.reducer/notes-view.reducer';
import {
  getVolume,
  getPlaybackRate,
  getPlayNoteTick,
  getCursorPositionInBeats,
} from '../reducers/navigation.reducer';
import {
  createBeatmapContents,
  createInfoContent,
} from '../services/packaging.service';
import {
  shiftEntitiesByOffset,
  unshiftEntitiesByOffset,
} from '../services/packaging.service.nitty-gritty';
import { EVENTS_VIEW } from '../constants';

import {
  generateWaveformForSongFile,
  stopAndRewindAudio,
} from './song.middleware.helpers';

export default function createSongMiddleware() {
  let animationFrameId = null;

  const ticker = new Sfx();

  let audioElem;

  return store => next => async action => {
    switch (action.type) {
      case 'START_LOADING_SONG': {
        next(action);

        const { songId, difficulty } = action;

        const state = store.getState();
        const song = getSongById(state, songId);
        const volume = getVolume(state);
        const playbackRate = getPlaybackRate(state);

        if (!song) {
          console.error(`Song "${songId}" not found. Current state:`, state);
          return;
        }

        // Fetch the json for this beatmap from our local store.
        let beatmapJson;
        try {
          beatmapJson = await getBeatmap(songId, difficulty);
        } catch (err) {
          console.error(err);
        }

        // we may not have any beatmap entities, if this is a new song
        // or new difficulty.
        if (beatmapJson) {
          // If we do, we need to manage a little dance related to offsets.
          // See offsets.md for more context, but essentially we need to
          // transform our timing to match the beat, by undoing a
          // transformation previously applied.
          let unshiftedNotes = unshiftEntitiesByOffset(
            beatmapJson._notes || [],
            song.offset,
            song.bpm
          );

          const unshiftedEvents = unshiftEntitiesByOffset(
            beatmapJson._events || [],
            song.offset,
            song.bpm
          );
          const unshiftedObstacles = unshiftEntitiesByOffset(
            beatmapJson._obstacles || [],
            song.offset,
            song.bpm
          );

          // our beatmap comes in a "raw" form, using proprietary fields.
          // At present, I'm using that proprietary structure for notes/mines,
          // but I have my own structure for obstacles and events.
          // So I need to convert the ugly JSON format to something manageable.
          let convertedObstacles = convertObstaclesToRedux(unshiftedObstacles);
          let convertedEvents = convertEventsToRedux(unshiftedEvents);
          let convertedBookmarks = convertBookmarksToRedux(
            beatmapJson._customData && beatmapJson._customData._bookmarks
          );

          next(
            loadBeatmapEntities(
              unshiftedNotes,
              convertedEvents,
              convertedObstacles,
              convertedBookmarks
            )
          );

          next(ReduxUndoActionCreators.clearHistory());
        }

        const file = await getFile(song.songFilename);

        // Create an <audio> element, which is the mechanism we use for
        // playing the track when the user is editing it, keeping the time,
        // etc.
        const fileBlobUrl = URL.createObjectURL(file);
        audioElem = createHtmlAudioElement(fileBlobUrl);
        audioElem.volume = volume;
        audioElem.playbackRate = playbackRate;

        stopAndRewindAudio(audioElem, song.offset);

        const waveform = await generateWaveformForSongFile(file);

        next(finishLoadingSong(song, waveform));

        break;
      }

      case 'CREATE_DIFFICULTY': {
        const { difficulty, afterCreate } = action;

        const state = store.getState();
        const song = getSelectedSong(state);
        const events = convertEventsToExportableJson(
          getAllEventsAsArray(state)
        );
        const shiftedEvents = shiftEntitiesByOffset(
          events,
          song.offset,
          song.bpm
        );

        const beatmapContents = createBeatmapContents(
          {
            // No notes/obstacles/bookmarks by default, but copy the lighting
            notes: [],
            obstacles: [],
            events: shiftedEvents,
            bookmarks: [],
          },
          { version: 2 }
        );

        const beatmapFilename = getFilenameForThing(song.id, 'beatmap', {
          difficulty,
        });

        return saveFile(beatmapFilename, beatmapContents).then(() => {
          next(action);

          if (typeof afterCreate === 'function') {
            afterCreate(difficulty);
          }
        });
      }

      case 'COPY_DIFFICULTY': {
        const { songId, fromDifficultyId, toDifficultyId, afterCopy } = action;

        // First, we need to load the file which contains the notes, events, etc
        // for the difficulty we want to copy.
        const sourceDifficultyFileContents = await getBeatmap(
          songId,
          fromDifficultyId
        );

        // Save it to our destination difficulty.
        await saveBeatmap(songId, toDifficultyId, sourceDifficultyFileContents);

        // Dispatch the original action, which should create the difficulty
        // in the song reducer
        next(action);

        // Pull that updated redux state and save it to our info.dat
        const state = store.getState();
        const song = getSongById(state, songId);

        // Back up our latest data!
        await saveInfoDat(
          song.id,
          createInfoContent(song, {
            version: 2,
          })
        );

        if (typeof afterCopy === 'function') {
          afterCopy(toDifficultyId);
        }

        break;
      }

      case 'TOGGLE_PLAYING': {
        const state = store.getState();

        if (state.navigation.isPlaying) {
          store.dispatch(pausePlaying());
        } else {
          store.dispatch(startPlaying());
        }

        break;
      }

      case 'START_PLAYING': {
        next({ type: 'START_PLAYING', timeElapsed: 0 });

        audioElem.play();

        let lastBeat = null;

        function tick() {
          const currentTime = audioElem.currentTime * 1000;

          const state = store.getState();
          const song = getSelectedSong(state);

          const playNoteTick = getPlayNoteTick(state);

          // TODO: pull from state
          const processingDelay = 60;
          const delayInBeats = convertMillisecondsToBeats(
            processingDelay,
            song.bpm
          );

          const currentBeat = convertMillisecondsToBeats(
            currentTime - song.offset,
            song.bpm
          );

          if (playNoteTick) {
            const anyNotesWithinTimespan = getNotes(state).some(
              note =>
                note._time - delayInBeats >= lastBeat &&
                note._time - delayInBeats < currentBeat &&
                note._type !== 3 // Don't tick for mines
            );

            if (anyNotesWithinTimespan) {
              ticker.trigger();
            }
          }

          lastBeat = currentBeat;

          next({
            type: 'TICK',
            timeElapsed: currentTime,
          });

          animationFrameId = window.requestAnimationFrame(tick);
        }

        animationFrameId = window.requestAnimationFrame(tick);
        break;
      }

      case 'SCRUB_WAVEFORM': {
        next(action);

        // When the song is playing, `cursorPosition` is fluid, moving every 16
        // milliseconds to a new fractional value.
        // Once we stop, we want to snap to the nearest beat.
        const state = store.getState();
        const song = getSelectedSong(state);

        const roundedCursorPosition = snapToNearestBeat(
          action.newOffset,
          song.bpm,
          song.offset
        );

        // Dispatch this new cursor position, but also seek to this place
        // in the audio, so that it is in sync.
        next(adjustCursorPosition(roundedCursorPosition));
        audioElem.currentTime = roundedCursorPosition / 1000;

        break;
      }

      case 'UPDATE_SONG_DETAILS': {
        next(action);

        // It's possible we updated the song file.
        // We should reload it, so that the audio is properly updated.
        const file = await getFile(action.songFilename);

        // Create an <audio> element, which is the mechanism we use for
        // playing the track when the user is editing it, keeping the time,
        // etc.
        const fileBlobUrl = URL.createObjectURL(file);

        audioElem.src = fileBlobUrl;
        stopAndRewindAudio(audioElem, action.offset);

        const waveform = await generateWaveformForSongFile(file);
        next(reloadWaveform(waveform));

        break;
      }

      case 'SCRUB_EVENTS_HEADER': {
        next(action);

        const state = store.getState();
        const song = getSelectedSong(state);
        const newCursorPosition =
          convertBeatsToMilliseconds(action.selectedBeat, song.bpm) +
          song.offset;

        next(adjustCursorPosition(newCursorPosition));
        audioElem.currentTime = newCursorPosition / 1000;

        break;
      }

      case 'SELECT_ALL_IN_RANGE': {
        const state = store.getState();
        const song = getSelectedSong(state);
        const newCursorPosition =
          convertBeatsToMilliseconds(action.start, song.bpm) + song.offset;

        next(adjustCursorPosition(newCursorPosition));
        audioElem.currentTime = newCursorPosition / 1000;
        audioElem.pause();

        next(action);

        break;
      }

      case 'JUMP_TO_BEAT': {
        next(action);

        const state = store.getState();
        const song = getSelectedSong(state);
        const newCursorPosition =
          convertBeatsToMilliseconds(action.beatNum, song.bpm) + song.offset;

        next(adjustCursorPosition(newCursorPosition));
        audioElem.currentTime = newCursorPosition / 1000;

        if (action.pauseTrack) {
          audioElem.pause();
        }

        break;
      }

      case 'SEEK_FORWARDS':
      case 'SEEK_BACKWARDS': {
        const { view } = action;

        next(action);

        const state = store.getState();
        const song = getSelectedSong(state);

        // In events view, we always want to jump ahead to the next window.
        // This is a bit tricky since it's not a fixed # of cells to jump.
        const cursorPositionInBeats = getCursorPositionInBeats(state);
        const beatsPerZoomLevel = getBeatsPerZoomLevel(state);

        const windowSize = view === EVENTS_VIEW ? beatsPerZoomLevel : 32;

        const currentWindowIndex = Math.floor(
          cursorPositionInBeats / windowSize
        );

        let newStartBeat;
        if (action.type === 'SEEK_FORWARDS') {
          newStartBeat = windowSize * (currentWindowIndex + 1);
        } else {
          // In notes view, this should work like the next/previous buttons
          // on CD players. If you click 'previous', it "rewinds" to the start
          // of the current window, unless you're in the first couple beats,
          // in which case it rewinds to the previous window.
          const progressThroughWindow = cursorPositionInBeats % windowSize;

          if (progressThroughWindow < 2) {
            newStartBeat = windowSize * (currentWindowIndex - 1);
          } else {
            newStartBeat = windowSize * currentWindowIndex;
          }
        }

        let newCursorPosition =
          convertBeatsToMilliseconds(newStartBeat, song.bpm) + song.offset;

        newCursorPosition = clamp(
          newCursorPosition,
          0,
          state.navigation.duration
        );

        next(adjustCursorPosition(newCursorPosition));
        audioElem.currentTime = newCursorPosition / 1000;

        break;
      }

      case 'SCROLL_THROUGH_SONG': {
        // If the song isn't loaded yet, ignore this action.
        // This can happen if the user starts scrolling before the song has
        // loaded.
        if (!audioElem) {
          return;
        }

        // Pass this action through, to update motion settings
        next(action);

        const state = store.getState();
        const song = getSelectedSong(state);
        const { direction } = action;

        // We want to jump by the amount that we're snapping to.
        const incrementInMs = convertBeatsToMilliseconds(
          state.navigation.snapTo,
          song.bpm
        );

        let newCursorPosition =
          direction === 'forwards'
            ? state.navigation.cursorPosition + incrementInMs
            : state.navigation.cursorPosition - incrementInMs;

        newCursorPosition = clamp(
          newCursorPosition,
          0,
          state.navigation.duration
        );

        audioElem.currentTime = newCursorPosition / 1000;

        next(adjustCursorPosition(newCursorPosition));

        break;
      }

      case 'LEAVE_EDITOR': {
        next(action);

        window.cancelAnimationFrame(animationFrameId);
        audioElem.pause();
        audioElem.currentTime = 0;
        break;
      }

      case 'PAUSE_PLAYING': {
        next(action);

        // When the song is playing, `cursorPosition` is fluid, moving every 16
        // milliseconds to a new fractional value.
        // Once we stop, we want to snap to the nearest beat.
        const state = store.getState();
        const song = getSelectedSong(state);

        window.cancelAnimationFrame(animationFrameId);
        audioElem.pause();

        const roundedCursorPosition = snapToNearestBeat(
          state.navigation.cursorPosition,
          song.bpm,
          song.offset
        );

        // Dispatch this new cursor position, but also seek to this place
        // in the audio, so that it is in sync.
        next(adjustCursorPosition(roundedCursorPosition));
        audioElem.currentTime = roundedCursorPosition / 1000;

        break;
      }

      case 'STOP_PLAYING': {
        next(action);

        window.cancelAnimationFrame(animationFrameId);

        if (audioElem) {
          audioElem.pause();

          stopAndRewindAudio(audioElem, action.offset);
        }

        break;
      }

      case 'SKIP_TO_START': {
        next(action);
        audioElem.currentTime = action.offset / 1000;
        break;
      }

      case 'SKIP_TO_END': {
        next(action);

        // Rather than go to the literal last millisecond in the song, we'll
        // jump 2 bars away from the very end. That seems most likely to be
        // useful.
        const state = store.getState();
        const song = getSelectedSong(state);

        const lastBeatInSong = Math.floor(
          convertMillisecondsToBeats(state.navigation.duration, song.bpm)
        );

        const newCursorPosition =
          convertBeatsToMilliseconds(lastBeatInSong - 8, song.bpm) +
          song.offset;

        next(adjustCursorPosition(newCursorPosition));
        audioElem.currentTime = newCursorPosition / 1000;

        break;
      }

      case 'UPDATE_VOLUME': {
        next(action);
        audioElem.volume = action.volume;
        break;
      }

      case 'UPDATE_PLAYBACK_SPEED': {
        next(action);
        audioElem.playbackRate = action.playbackRate;
        break;
      }

      case 'DELETE_BEATMAP': {
        const { songId, difficulty } = action;

        // Our reducer will handle the redux state part, but we also need to
        // delete the corresponding beatmap from the filesystem.
        const beatmapFilename = getFilenameForThing(songId, 'beatmap', {
          difficulty,
        });
        await deleteFile(beatmapFilename);

        next(action);
        break;
      }

      case 'DELETE_SONG': {
        const state = store.getState();
        const song = getSongById(state, action.songId);

        deleteAllSongFiles(song);

        next(action);

        break;
      }

      default: {
        return next(action);
      }
    }
  };
}
