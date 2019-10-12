/**
 * NOTE: I don't really think this middleware is necessary.
 * I think all this stuff can be done at the component level, maybe put into
 * helper functions if it feels crowded.
 *
 * Will do a different approach for events. This is just for notes-view stuff.
 */
import {
  selectNote,
  deselectNote,
  deleteNote,
  bulkDeleteNote,
  toggleNoteColor,
} from '../actions';
import { findNoteByProperties } from '../helpers/notes.helpers';
import { getNotes } from '../reducers/editor-entities.reducer/notes-view.reducer';

export default function createSelectionMiddleware() {
  return store => next => action => {
    switch (action.type) {
      case 'CLICK_NOTE': {
        const state = store.getState();
        const note = findNoteByProperties(getNotes(state), action);

        if (action.clickType === 'middle') {
          next(
            toggleNoteColor(action.time, action.lineLayer, action.lineIndex)
          );
        } else if (action.clickType === 'right') {
          next(deleteNote(action.time, action.lineLayer, action.lineIndex));
        } else if (note.selected) {
          next(deselectNote(action.time, action.lineLayer, action.lineIndex));
        } else {
          next(selectNote(action.time, action.lineLayer, action.lineIndex));
        }

        break;
      }

      case 'MOUSE_OVER_NOTE': {
        const state = store.getState();
        const { selectionMode } = state.editor.notes;

        // Ignore any mouseovers when not in a selection mode
        if (!selectionMode) {
          return;
        }

        // Find the note we're mousing over
        const note = findNoteByProperties(getNotes(state), action);

        // If the selection mode is delete, we can simply remove this note.
        if (selectionMode === 'delete') {
          return next(
            bulkDeleteNote(action.time, action.lineLayer, action.lineIndex)
          );
        }

        // Ignore double-positives or double-negatives
        const alreadySelected = note.selected && selectionMode === 'select';
        const alreadyDeselected =
          !note.selected && selectionMode === 'deselect';
        if (alreadySelected || alreadyDeselected) {
          return;
        }

        if (note.selected) {
          return next(
            deselectNote(action.time, action.lineLayer, action.lineIndex)
          );
        } else {
          return next(
            selectNote(action.time, action.lineLayer, action.lineIndex)
          );
        }
      }

      default:
        return next(action);
    }
  };
}
