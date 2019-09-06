export const getBackgroundBoxes = (
  events,
  initialLightingValue,
  startBeat,
  numOfBeatsToShow
) => {
  let backgroundBoxes = [];

  // If the initial lighting value is true, we wanna convert it into a pseudo-
  // event. It's simpler if we treat it as an 'on' event at the very first beat
  // of the section.
  const workableEvents = [...events];
  if (initialLightingValue) {
    workableEvents.unshift({
      type: 'on',
      beatNum: startBeat,
    });
  }

  const onEvents = workableEvents.filter(
    ev => ev.type === 'on' || ev.type === 'flash'
  );
  const offEvents = workableEvents.filter(
    ev => ev.type !== 'on' && ev.type !== 'flash'
  );

  if (initialLightingValue && offEvents.length === 0) {
    backgroundBoxes.push({
      beatNum: startBeat,
      duration: startBeat + numOfBeatsToShow,
    });
    return backgroundBoxes;
  }

  if (onEvents.length === 0) {
  }

  return [];
};
