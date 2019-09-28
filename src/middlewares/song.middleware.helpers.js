import webAudioBuilder from 'waveform-data/webaudio';

import { convertFileToArrayBuffer } from '../helpers/file.helpers';

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
