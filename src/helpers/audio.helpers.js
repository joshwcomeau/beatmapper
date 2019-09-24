import webAudioBuilder from 'waveform-data/webaudio';

import { roundToNearest } from '../utils';

// Our most precise snapping increments are 1/24 and 1/32.
// These two numbers share 1/96 as their lowest common multiple
const LOWEST_COMMON_MULTIPLE = 1 / 96;

export const createHtmlAudioElement = url => {
  const elem = document.createElement('audio');
  elem.src = url;
  return elem;
};

export const convertMillisecondsToBeats = (ms, bpm) => {
  const bps = bpm / 60;

  let beats = (ms / 1000) * bps;

  // To avoid floating-point issues like 2.999999997, let's round. We'll choose
  // the lowest-common-multiple to "snap" to any possible value.
  return roundToNearest(beats, LOWEST_COMMON_MULTIPLE);
};

export const convertBeatsToMilliseconds = (beats, bpm) => {
  const bps = bpm / 60;
  return (beats / bps) * 1000;
};

export const getWaveformDataForFile = file => {
  const fileBlobUrl = URL.createObjectURL(file);
  const audioContext = new AudioContext();

  return new Promise((resolve, reject) => {
    fetch(fileBlobUrl)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        webAudioBuilder(audioContext, buffer, (err, waveform) => {
          if (err) {
            reject(err);
          }

          resolve(waveform);
        });
      });
  });
};

export const snapToNearestBeat = (cursorPosition, bpm, offset) => {
  // cursorPosition will be a fluid value in ms, like 65.29.
  // I need to snap to the nearest bar.
  // So if my BPM is 60, there is a bar every 4 seconds, so I'd round to
  // 64ms.
  // Note that BPMs can be any value, even fractions, so I can't rely on
  // a decimal rounding solution :/
  const cursorPositionInBeats = convertMillisecondsToBeats(
    cursorPosition - offset,
    bpm
  );

  return (
    convertBeatsToMilliseconds(Math.round(cursorPositionInBeats), bpm) + offset
  );
};

export const getFormattedTimestamp = cursorPosition => {
  const seconds = String(Math.floor((cursorPosition / 1000) % 60)).padStart(
    2,
    '0'
  );
  const minutes = String(
    Math.floor((cursorPosition / (1000 * 60)) % 60)
  ).padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const getFormattedBeatNum = cursorPositionInBeats => {
  const beatNum = Math.floor(cursorPositionInBeats);
  const remainder = String(
    roundToNearest(Math.abs(cursorPositionInBeats) % 1, LOWEST_COMMON_MULTIPLE)
  )
    .replace('0.', '')
    .slice(0, 3)
    .padEnd(3, '0');

  return `${beatNum}.${remainder}`;
};
