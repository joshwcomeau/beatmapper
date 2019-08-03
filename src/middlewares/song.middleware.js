/**
 * This middleware manages playback concerns.
 */
import webAudioBuilder from 'waveform-data/webaudio';
import { ActionCreators as ReduxUndoActionCreators } from 'redux-undo';

import {
  finishLoadingSong,
  adjustCursorPosition,
  startPlaying,
  pausePlaying,
  loadBeatmapEntities,
} from '../actions';
import {
  createHtmlAudioElement,
  snapToNearestBeat,
  convertBeatsToMilliseconds,
  convertMillisecondsToBeats,
} from '../helpers/audio.helpers';
import { convertFileToArrayBuffer } from '../helpers/file.helpers';
import { convertObstaclesToRedux } from '../helpers/obstacles.helpers';
import { clamp, roundToNearest } from '../utils';
import {
  getFile,
  getBeatmap,
  deleteAllSongFiles,
} from '../services/file.service';
import Sfx from '../services/sfx.service';
import { getSongById, getSelectedSong } from '../reducers/songs.reducer';
import { getNotes } from '../reducers/editor-entities.reducer';
import {
  getVolume,
  getPlaybackRate,
  getPlayNoteTick,
  getCursorPositionInBeats,
} from '../reducers/navigation.reducer';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function createSongMiddleware() {
  let animationFrameId = null;

  const ticker = new Sfx();

  let audioElem;
  let currentLoadedSongId;

  return store => next => async action => {
    switch (action.type) {
      case 'START_LOADING_SONG': {
        const { songId, difficulty } = action;

        next(action);

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

        // our beatmap comes in a "raw" form, using proprietary fields.
        // At present, I'm using that proprietary structure for notes/mines,
        // but I have my own structure for obstacles (and I hope to update
        // notes as well maybe?)
        // Convert the .dat fields to redux-friendly ones.
        let obstacles = beatmapJson && beatmapJson._obstacles;
        const convertedObstacles = convertObstaclesToRedux(obstacles || []);

        // we may not have any beatmap entities, if this is a new song
        // or new difficulty.
        if (beatmapJson) {
          next(
            loadBeatmapEntities(
              beatmapJson._notes,
              beatmapJson._events,
              convertedObstacles
            )
          );

          next(ReduxUndoActionCreators.clearHistory());
        }

        const file = await getFile(song.songFilename);

        // Create an <audio> element, which is the mechanism we use for
        // playing the track when the user is editing it, keeping the time,
        // etc.
        if (currentLoadedSongId === song.id) {
          return;
        }

        const fileBlobUrl = URL.createObjectURL(file);
        audioElem = createHtmlAudioElement(fileBlobUrl);
        audioElem.volume = volume;
        audioElem.playbackRate = playbackRate;

        // Loading an array buffer consumes it, weirdly. I don't believe that
        // this is a mistake I'm making, it appears to be a part of the Web
        // Audio API. So, we need to reload the buffer.
        const arrayBuffer = await convertFileToArrayBuffer(file);

        // Generate the waveform, for scrubbing:
        const audioContext = new AudioContext();
        webAudioBuilder(audioContext, arrayBuffer, (err, waveform) => {
          if (err) {
            throw new Error(err);
          }

          const durationInMs = waveform.duration * 1000;

          currentLoadedSongId = song.id;

          next(finishLoadingSong(song, durationInMs, waveform));
        });

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

        let roundedRecentBeat = null;

        function tick() {
          const state = store.getState();
          const playNoteTick = getPlayNoteTick(state);

          if (playNoteTick) {
            const currentBeat = roundToNearest(
              getCursorPositionInBeats(state),
              1 / 4
            );

            if (currentBeat !== roundedRecentBeat) {
              roundedRecentBeat = currentBeat;

              // Check and see if there's at least 1 note on this beat.
              const shouldTick = getNotes(state).some(
                note => note._time === currentBeat
              );

              if (shouldTick) {
                ticker.trigger();
              }
            }
          }

          next({
            type: 'TICK',
            timeElapsed: audioElem.currentTime * 1000,
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

      case 'JUMP_TO_BAR': {
        next(action);

        const state = store.getState();
        const song = getSelectedSong(state);
        const newCursorPosition =
          convertBeatsToMilliseconds(action.barNum * 4, song.bpm) + song.offset;

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
        window.cancelAnimationFrame(animationFrameId);
        audioElem.pause();
        break;
      }

      case 'PAUSE_PLAYING': {
        next(action);

        window.cancelAnimationFrame(animationFrameId);
        audioElem.pause();

        // When the song is playing, `cursorPosition` is fluid, moving every 16
        // milliseconds to a new fractional value.
        // Once we stop, we want to snap to the nearest beat.
        const state = store.getState();
        const song = getSelectedSong(state);

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

        const newCursorPosition = convertBeatsToMilliseconds(
          lastBeatInSong - 8,
          song.bpm
        );

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
