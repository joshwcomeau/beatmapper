import webAudioBuilder from 'waveform-data/webaudio';

import { adjustCursorPosition } from '../actions';
import { convertFileToArrayBuffer } from '../helpers/file.helpers';
import {
  convertBeatsToMilliseconds,
  convertMillisecondsToBeats,
} from '../helpers/audio.helpers';
import { getNotes } from '../reducers/editor-entities.reducer/notes-view.reducer';
import { getPlayNoteTick } from '../reducers/navigation.reducer';
import { getSelectedSong } from '../reducers/songs.reducer';
import {
  getIsLockedToCurrentWindow,
  getBeatsPerZoomLevel,
} from '../reducers/editor.reducer';
import { floorToNearest } from '../utils';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const stopAndRewindAudio = (audioElem, offset) => {
  audioElem.currentTime = (offset || 0) / 1000;
};

export const generateWaveformForSongFile = async file => {
  // Loading an array buffer consumes it, weirdly. I don't believe that
  // this is a mistake I'm making, it appears to be a part of the Web
  // Audio API. So, we need to reload the buffer.
  const arrayBuffer = await convertFileToArrayBuffer(file);

  // Generate the waveform, for scrubbing:
  const audioContext = new AudioContext();

  return new Promise((resolve, reject) => {
    webAudioBuilder(audioContext, arrayBuffer, (err, waveform) => {
      if (err) {
        reject(err);
      }

      resolve(waveform);
    });
  });
};

export const triggerTickerIfNecessary = (
  state,
  currentBeat,
  lastBeat,
  ticker
) => {
  const song = getSelectedSong(state);

  const playNoteTick = getPlayNoteTick(state);

  if (playNoteTick) {
    // TODO: pull from state, allow users to customize it in a settings
    // modal or similar
    const processingDelay = 60;
    const delayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

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
};

export const shouldLoopToStartOfWindow = (
  state,
  currentBeat,
  lastBeat,
  audioElem,
  next
) => {
  const isLockedToCurrentWindow = getIsLockedToCurrentWindow(state);
  const beatsPerZoomLevel = getBeatsPerZoomLevel(state);

  if (!isLockedToCurrentWindow) {
    return;
  }

  // Alrighty, so we can look at which beat is the start for the last window
  // vs the current one. If that window has changed, we want to reset the
  // playback time to the start of that last window.
  const startBeatForLastWindow = floorToNearest(lastBeat, beatsPerZoomLevel);
  const startBeatForCurrentWindow = floorToNearest(
    currentBeat,
    beatsPerZoomLevel
  );

  return startBeatForLastWindow !== startBeatForCurrentWindow;
};
