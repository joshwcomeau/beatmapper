import React from 'react';
import { connect } from 'react-redux';

import {
  BLOCK_COLUMN_WIDTH,
  SONG_OFFSET,
  HIGHEST_PRECISION,
} from '../../constants';
import * as actions from '../../actions';
import { getColorForItem } from '../../helpers/colors.helpers';
import {
  getCursorPositionInBeats,
  getBeatDepth,
} from '../../reducers/navigation.reducer';
import { getVisibleNotes } from '../../reducers/editor-entities.reducer/notes-view.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';
import { roundAwayFloatingPointNonsense } from '../../utils';

import Block from '../Block';
import Mine from '../Mine';

const getPositionForBlock = (note, beatDepth) => {
  const x = note._lineIndex * BLOCK_COLUMN_WIDTH - BLOCK_COLUMN_WIDTH * 1.5;
  const y = note._lineLayer * BLOCK_COLUMN_WIDTH - BLOCK_COLUMN_WIDTH;

  // We want to first lay the notes out with proper spacing between them.
  // beatDepth controls the distance between two 1/4 notes.
  //
  // We want this to all be BPM-independent; two quarter notes should be equally
  // distant regardless of BPM. To do this, we have to convert the note time
  // into notes.
  //
  // First, get the note's "starting" position. Where it is when the song is
  // at 0:00
  const startingPosition = note._time * beatDepth * -1;

  // Next, take into account that the song is playing. `cursorPosition` will
  // continue to grow, and we need to cursorPosition it by the right number of
  // beats.

  const z = startingPosition - SONG_OFFSET;

  return { x, y, z };
};

const SongBlocks = ({
  song,
  notes,
  cursorPositionInBeats,
  beatDepth,
  selectionMode,
  clickNote,
  startManagingNoteSelection,
  finishManagingNoteSelection,
  mouseOverNote,
}) => {
  const zPosition = -SONG_OFFSET + cursorPositionInBeats * beatDepth;

  // I can click on a block to start selecting it.
  // If I hold the mouse down, I can drag to select (or deselect) many notes
  // at a time.
  // For this to work, I need to know when they start clicking and stop
  // clicking. For starting clicking, I can use the `SELECT_NOTE` action,
  // triggered when clicking a block... but they might not be over a block
  // when they release the mouse. So instead I need to use a mouseUp handler
  // up here.
  React.useEffect(() => {
    if (!selectionMode) {
      return;
    }

    const handleMouseUp = () => {
      // Wait 1 frame before wrapping up. This is to prevent the selection
      // mode from changing before all event-handlers have been processed.
      // Without the delay, the user might accidentally add notes to the
      // placement grid - further up in the React tree - if they release the
      // mouse while over a grid tile.
      window.requestAnimationFrame(finishManagingNoteSelection);
    };

    window.addEventListener('mouseup', handleMouseUp);

    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [selectionMode, finishManagingNoteSelection]);

  return notes.map((note, index) => {
    const { x, y, z } = getPositionForBlock(note, beatDepth);
    let noteZPosition = roundAwayFloatingPointNonsense(zPosition + z);
    // HACK: So I'm winding up with zPositions of like 11.999994, and it's
    // making the notes transparent because they're 0.000006 before the
    // placement grid. I imagine there's a better place to manage this than
    // here, but I'm sick of this problem.
    const adjustment = beatDepth * HIGHEST_PRECISION;
    const adjustedNoteZPosition = noteZPosition - adjustment;

    const NoteComponent = note._type === 3 ? Mine : Block;

    return (
      <NoteComponent
        x={x}
        y={y}
        z={z}
        key={`${note._time}-${note._lineLayer}-${note._lineIndex}`}
        time={note._time}
        lineLayer={note._lineLayer}
        lineIndex={note._lineIndex}
        direction={note._cutDirection}
        color={getColorForItem(note._type, song)}
        isTransparent={adjustedNoteZPosition > -SONG_OFFSET * 2}
        isSelected={note.selected}
        selectionMode={selectionMode}
        handleClick={clickNote}
        handleStartSelecting={startManagingNoteSelection}
        handleMouseOver={mouseOverNote}
      />
    );
  });
};

const mapStateToProps = state => {
  return {
    song: getSelectedSong(state),
    notes: getVisibleNotes(state),
    cursorPositionInBeats: getCursorPositionInBeats(state),
    beatDepth: getBeatDepth(state),
    selectionMode: state.editor.notes.selectionMode,
  };
};

const mapDispatchToProps = {
  clickNote: actions.clickNote,
  mouseOverNote: actions.mouseOverNote,
  startManagingNoteSelection: actions.startManagingNoteSelection,
  finishManagingNoteSelection: actions.finishManagingNoteSelection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SongBlocks);
