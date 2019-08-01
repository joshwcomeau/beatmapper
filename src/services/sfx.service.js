/**
 * This mini-service wraps the AudioSample service to provide an easy-to-use
 * tick SFX.
 */
import AudioSample from './audio.service';

import defaultSfxPath from '../assets/sounds/tick-alt.mp3';

class Sfx {
  constructor(sfxPath = defaultSfxPath) {
    this.audioSample = new AudioSample();

    fetch(defaultSfxPath)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => this.audioSample.load(arrayBuffer));
  }

  trigger() {
    this.audioSample.pause();
    this.audioSample.setCurrentTime(0);
    this.audioSample.play();
  }
}

export default Sfx;
