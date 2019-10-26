/**
 * Utilities around prompting the user for information.
 * Currently uses window.prompt, but I should build something prettier.
 */

export const promptQuickSelect = (view, wrappedAction) => {
  let beatStr = window.prompt(
    'Quick-select all entities in a given range of beats. Eg. "16-32" will select everything from beat 16 to 32.'
  );

  if (!beatStr) {
    return;
  }

  beatStr = beatStr.replace(/\s/g, ''); // Remove whitespace

  const startAndEnd = beatStr.split('-');
  let [start, end] = startAndEnd.map(Number);

  if (typeof end !== 'number') {
    end = Infinity;
  }

  wrappedAction(view, start, end);
};

export const promptJumpToBeat = (wrappedAction, ...additionalArgs) => {
  const beatNum = window.prompt(
    'Enter the beat number you wish to jump to (eg. 16)'
  );

  if (beatNum === null || beatNum === '') {
    return;
  }

  return wrappedAction(Number(beatNum), ...additionalArgs);
};

export const promptChangeObstacleDuration = (obstacle, wrappedAction) => {
  const { id, beatDuration } = obstacle;

  const newDuration = window.prompt(
    'Enter the duration for this wall, in beats',
    beatDuration
  );

  if (newDuration === null || newDuration === '') {
    return;
  }

  return wrappedAction(id, Number(newDuration));
};
