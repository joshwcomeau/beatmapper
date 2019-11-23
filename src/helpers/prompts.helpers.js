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

export const promptChangeObstacleDuration = (obstacles, wrappedAction) => {
  const { beatDuration } = obstacles[0];

  const promptCopy =
    obstacles.length === 1
      ? 'Enter the new duration for this wall, in beats'
      : 'Enter the new duration for all selected walls';

  const newDuration = window.prompt(promptCopy, beatDuration);

  if (newDuration === null || newDuration === '') {
    return;
  }

  const selectedObstacleDurations = {};
  obstacles.forEach(obstacle => {
    selectedObstacleDurations[obstacle.beatDuration] = true;
  });
  const numOfDifferentDurations = Object.keys(selectedObstacleDurations).length;

  if (numOfDifferentDurations > 1) {
    const hasConfirmed = window.confirm(
      `Warning: You've selected obstacles with different durations. This will set all selected obstacles to ${newDuration} ${
        newDuration === 1 ? 'beat' : 'beats'
      }. Is this what you want?`
    );

    if (!hasConfirmed) {
      return;
    }
  }

  return wrappedAction(Number(newDuration));
};

export const promptSaveGridPreset = (gridPresets, wrappedAction) => {
  const presetSlots = ['1', '2', '3', '4'];
  const suggestedPreset = presetSlots.find(n => !gridPresets[n]);

  const providedValue = window.prompt(
    'Select a number from 1 to 4 to store this preset',
    suggestedPreset
  );

  if (!providedValue) {
    return;
  }

  const isValidInput = presetSlots.some(n => n === providedValue);

  if (!isValidInput) {
    window.alert(
      'The value you provided was not accepted. Please enter 1, 2, 3, or 4.'
    );
  }

  return wrappedAction(providedValue);
};
