// TODO: Should I just give notes an ID?
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

export const getNoteDensity = (numOfNotes, segmentLengthInBeats, bpm) => {
  if (numOfNotes === 0) {
    return 0;
  }

  const numOfNotesPerBeat = numOfNotes / segmentLengthInBeats;
  const notesPerSecond = (numOfNotesPerBeat * 60) / bpm;

  return notesPerSecond;
};
