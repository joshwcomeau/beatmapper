export const getBackgroundBoxes = (
  events,
  initialLightingValue,
  startBeat,
  numOfBeatsToShow
) => {
  let backgroundBoxes = [];
  const onEvents = events.filter(ev => ev.type === 'on' || ev.type === 'flash');
  const offEvents = events.filter(
    ev => ev.type !== 'on' && ev.type !== 'flash'
  );

  if (initialLightingValue && offEvents.length === 0) {
    backgroundBoxes.push({
      beatNum: startBeat,
      duration: startBeat + numOfBeatsToShow,
    });
    return backgroundBoxes;
  }

  return [];
};
