import { EVENT_TRACKS } from '../../constants';

const getIsEventOn = ev => ev.type === 'on' || ev.type === 'flash';

const getIsLightingTrack = trackId => {
  const track = EVENT_TRACKS.find(t => t.id === trackId);

  if (!track) {
    throw new Error('Unrecognized trackId: ' + trackId);
  }

  if (track.type !== 'blocks') {
    return false;
  }

  if (track.id === 'smallRing' || track.id === 'largeRing') {
    return false;
  }

  return true;
};

export const getBackgroundBoxes = (
  events,
  trackId,
  initialTrackLightingColorType,
  startBeat,
  numOfBeatsToShow
) => {
  // If this track isn't a lighting track, bail early.
  const isLightingTrack = getIsLightingTrack(trackId);
  if (!isLightingTrack) {
    return [];
  }

  let backgroundBoxes = [];

  // If the initial lighting value is true, we wanna convert it into a pseudo-
  // event. It's simpler if we treat it as an 'on' event at the very first beat
  // of the section.
  const workableEvents = [...events];
  if (initialTrackLightingColorType) {
    const pseudoInitialEvent = {
      id: `initial-${startBeat}-${numOfBeatsToShow}`,
      type: 'on',
      beatNum: startBeat,
      colorType: initialTrackLightingColorType,
    };

    workableEvents.unshift(pseudoInitialEvent);

    // SPECIAL CASE: initially lit but with no events in the window
    if (events.length === 0) {
      backgroundBoxes.push({
        id: pseudoInitialEvent.id,
        beatNum: pseudoInitialEvent.beatNum,
        duration: numOfBeatsToShow,
        colorType: pseudoInitialEvent.colorType,
      });

      return backgroundBoxes;
    }
  }

  let tentativeBox = null;

  workableEvents.forEach(event => {
    const isEventOn = getIsEventOn(event);

    // relevant possibilities:
    // It was off, and now it's on
    // It was on, and not it's off
    // It was red, and now it's blue (or vice versa)
    // It hasn't changed (blue -> blue, red -> red, or off -> off)

    // 1. It was off and now it's on
    if (!tentativeBox && isEventOn) {
      tentativeBox = {
        id: event.id,
        beatNum: event.beatNum,
        duration: undefined,
        colorType: event.colorType,
      };
      return;
    }

    // 2. It was on, and now it's off
    if (tentativeBox && !isEventOn) {
      tentativeBox.duration = event.beatNum - tentativeBox.beatNum;
      backgroundBoxes.push(tentativeBox);

      tentativeBox = null;
    }

    // 3. Color changed
    if (
      tentativeBox &&
      isEventOn &&
      tentativeBox.colorType !== event.colorType
    ) {
      tentativeBox.duration = event.beatNum - tentativeBox.beatNum;
      backgroundBoxes.push(tentativeBox);

      tentativeBox = {
        id: event.id,
        beatNum: event.beatNum,
        duration: undefined,
        colorType: event.colorType,
      };

      return;
    }
  });

  // If there's still a tentative box after iterating through all events, it
  // means that it should remain on after the current window. Stretch it to
  // fill the available space.
  if (tentativeBox) {
    const endBeat = startBeat + numOfBeatsToShow;
    const durationRemaining = endBeat - tentativeBox.beatNum;
    tentativeBox.duration = durationRemaining;
    backgroundBoxes.push(tentativeBox);
  }

  return backgroundBoxes;
};
