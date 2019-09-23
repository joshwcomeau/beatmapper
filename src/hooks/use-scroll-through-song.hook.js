import { isMetaKeyPressed } from '../utils';
import useMousewheel from './use-mousewheel.hook';

export default function useScrollThroughSong(
  canvasRef,
  isPlaying,
  scrollThroughSong
) {
  useMousewheel(canvasRef, true, ev => {
    // Ignore mousewheels when the ctrl key is held.
    // Those mousewheel events will be captured above, for changing the
    // snapping.
    if (isMetaKeyPressed(ev)) {
      return;
    }

    ev.preventDefault();

    const direction = ev.deltaY < 0 ? 'forwards' : 'backwards';

    if (!isPlaying) {
      scrollThroughSong(direction);
    }
  });
}
