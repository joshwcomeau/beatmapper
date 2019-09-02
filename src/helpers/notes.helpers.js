import uuid from 'uuid/v1';

const HUMANIZED_DIRECTIONS = [
  'up',
  'down',
  'left',
  'right',
  'upLeft',
  'upRight',
  'downLeft',
  'downRight',
  'face',
];

/**
 * NOTE: Currently, the "redux" variant of the blocks format isn't used.
 * I use the proprietary json format everywhere.
 * I want to refactor this, to keep everything in line between blocks,
 * obstacles, and mines. TODO.
 */
export const convertBlocksToRedux = blocks => {
  return blocks.map(b => {
    return {
      id: uuid(),
      color: b._type === 0 ? 'blue' : 'red',
      direction: HUMANIZED_DIRECTIONS[b._cutDirection],
      beatNum: b._time,
      rowIndex: b._lineLayer,
      colIndex: b._lineIndex,
    };
  });
};

export const convertBlocksToExportableJson = blocks => {
  return blocks.map(b => ({
    _time: b.beatNum,
    _lineIndex: b.colIndex,
    _lineLayer: b.rowIndex,
    _type: b.color === 'blue' ? 0 : 1,
    _cutDirection: HUMANIZED_DIRECTIONS.indexOf(b.direction),
  }));
};

export const findNoteByProperties = (notes, { time, lineLayer, lineIndex }) => {
  return notes.find(note => {
    return (
      note._time === time &&
      note._lineLayer === lineLayer &&
      note._lineIndex === lineIndex
    );
  });
};
export const findNoteIndexByProperties = (
  notes,
  { time, lineLayer, lineIndex }
) => {
  return notes.findIndex(note => {
    return (
      note._time === time &&
      note._lineLayer === lineLayer &&
      note._lineIndex === lineIndex
    );
  });
};

const getHorizontallyFlippedCutDirection = cutDirection => {
  //  4 0 5
  //  2 8 3
  //  6 1 7

  switch (cutDirection) {
    case 0:
    case 8:
    case 1:
      return cutDirection;

    case 4:
    case 2:
    case 6:
      return cutDirection + 1;

    case 5:
    case 3:
    case 7:
      return cutDirection - 1;

    default:
      throw new Error('Unrecognized cut direction: ' + cutDirection);
  }
};
const getVerticallyFlippedCutDirection = cutDirection => {
  //  4 0 5
  //  2 8 3
  //  6 1 7

  switch (cutDirection) {
    case 2:
    case 8:
    case 3:
      return cutDirection;

    case 4:
    case 5:
      return cutDirection + 2;

    case 0:
      return cutDirection + 1;

    case 1:
      return cutDirection - 1;

    case 6:
    case 7:
      return cutDirection - 2;

    default:
      throw new Error('Unrecognized cut direction: ' + cutDirection);
  }
};

export const swapNotesHorizontally = notes => {
  return notes.map(note => {
    if (!note.selected) {
      return note;
    }

    // swapping a note means three things:
    // - Moving its lineIndex to the opposite quadrant,
    // - flipping its cutDirection to face the opposite way, and
    // - changing its color
    const newLineIndex = 3 - note._lineIndex;
    const newCutDirection = getHorizontallyFlippedCutDirection(
      note._cutDirection
    );
    const newType = note._type === 0 ? 1 : note._type === 1 ? 0 : note._type;

    return {
      ...note,
      _lineIndex: newLineIndex,
      _cutDirection: newCutDirection,
      _type: newType,
    };
  });
};

export const swapNotesVertically = notes => {
  return notes.map(note => {
    if (!note.selected) {
      return note;
    }

    const newLineLayer = 2 - note._lineLayer;
    const newCutDirection = getVerticallyFlippedCutDirection(
      note._cutDirection
    );

    return {
      ...note,
      _lineLayer: newLineLayer,
      _cutDirection: newCutDirection,
    };
  });
};

export const swapNotes = (axis, notes) => {
  if (axis === 'horizontal') {
    return swapNotesHorizontally(notes);
  } else {
    return swapNotesVertically(notes);
  }
};

export const calculateNoteDensity = (numOfNotes, segmentLengthInBeats, bpm) => {
  if (numOfNotes === 0) {
    return 0;
  }

  const numOfNotesPerBeat = numOfNotes / segmentLengthInBeats;
  const notesPerSecond = numOfNotesPerBeat * (bpm / 60);

  return notesPerSecond;
};
