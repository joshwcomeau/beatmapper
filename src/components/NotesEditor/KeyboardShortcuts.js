/**
 * NOTE: This file contains a lot of duplication from
 * NotesEditor/KeyboardShortcuts. It's probably a good idea to consolidate
 * "shared" bindings between them.
 */
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { SNAPPING_INCREMENTS, NOTES_VIEW } from '../../constants';
import { throttle, isMetaKeyPressed } from '../../utils';
import useMousewheel from '../../hooks/use-mousewheel.hook';

const KeyboardShortcuts = ({
  togglePlaying,
  scrollThroughSong,
  deleteSelectedNotes,
  changeSnapping,
  incrementSnapping,
  decrementSnapping,
  selectNextTool,
  selectPreviousTool,
  selectTool,
  deselectAll,
  selectNoteDirection,
  copySelectedNotes,
  cutSelectedNotes,
  pasteSelectedNotes,
  undoNotes,
  redoNotes,
  swapSelectedNotes,
  toggleSelectAll,
  jumpToBar,
  skipToStart,
  skipToEnd,
}) => {
  let keysDepressed = React.useRef({
    space: false,
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const throttledScroller = throttle(scrollThroughSong, 50);

  const handleKeyDown = ev => {
    // If the control key and a number is pressed, we want to update snapping.
    if (isMetaKeyPressed(ev) && !isNaN(Number(ev.key))) {
      ev.preventDefault();

      const newSnappingIncrement = SNAPPING_INCREMENTS.find(
        increment => increment.shortcutKey === Number(ev.key)
      );

      // ctrl+0 doesn't do anything atm
      if (!newSnappingIncrement) {
        return;
      }

      changeSnapping(newSnappingIncrement.value);
    }

    switch (ev.code) {
      case 'Space': {
        // If the user holds down the space, we don't want to register a bunch
        // of play/pause events.
        if (keysDepressed.current.space) {
          return;
        }

        keysDepressed.current.space = true;

        return togglePlaying();
      }

      case 'Escape': {
        return deselectAll(NOTES_VIEW);
      }

      case 'Tab': {
        ev.preventDefault();

        if (ev.shiftKey) {
          selectPreviousTool(NOTES_VIEW);
        } else {
          selectNextTool(NOTES_VIEW);
        }

        return;
      }

      case 'Digit1':
        return selectTool(NOTES_VIEW, 'red-block');
      case 'Digit2':
        return selectTool(NOTES_VIEW, 'blue-block');
      case 'Digit3':
        return selectTool(NOTES_VIEW, 'mine');
      case 'Digit4':
        return selectTool(NOTES_VIEW, 'obstacle');

      case 'ArrowUp':
      case 'PageUp': {
        return throttledScroller('forwards');
      }
      case 'ArrowDown':
      case 'PageDown': {
        return throttledScroller('backwards');
      }
      case 'Home': {
        return skipToStart();
      }
      case 'End': {
        return skipToEnd();
      }

      case 'Delete': {
        return deleteSelectedNotes();
      }

      case 'KeyX': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return cutSelectedNotes();
      }
      case 'KeyC': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return copySelectedNotes();
      }
      case 'KeyV': {
        if (!isMetaKeyPressed(ev)) {
          return swapSelectedNotes('vertical');
        }
        return pasteSelectedNotes();
      }

      case 'KeyH': {
        return swapSelectedNotes('horizontal');
      }
      case 'KeyJ': {
        const bar = window.prompt(
          'Enter bar number (eg. 1.25 for the 5th beat)'
        );

        if (bar === null || bar === '') {
          return;
        }

        const barNum = Number(bar);

        return jumpToBar(barNum);
      }

      case 'KeyW': {
        if (ev.shiftKey) {
          return;
        }
        keysDepressed.current.w = true;

        if (keysDepressed.current.a) {
          return selectNoteDirection(4);
        } else if (keysDepressed.current.d) {
          return selectNoteDirection(5);
        } else {
          return selectNoteDirection(0);
        }
      }
      case 'KeyA': {
        if (ev.shiftKey) {
          return;
        }
        if (isMetaKeyPressed(ev)) {
          ev.preventDefault();
          return toggleSelectAll(NOTES_VIEW);
        }

        keysDepressed.current.a = true;

        if (keysDepressed.current.w) {
          return selectNoteDirection(4);
        } else if (keysDepressed.current.s) {
          return selectNoteDirection(6);
        } else {
          return selectNoteDirection(2);
        }
      }
      case 'KeyS': {
        if (ev.shiftKey) {
          return;
        }
        keysDepressed.current.s = true;

        if (keysDepressed.current.a) {
          return selectNoteDirection(6);
        } else if (keysDepressed.current.d) {
          return selectNoteDirection(7);
        } else {
          return selectNoteDirection(1);
        }
      }
      case 'KeyD': {
        if (ev.shiftKey) {
          return;
        }
        keysDepressed.current.d = true;

        if (keysDepressed.current.w) {
          return selectNoteDirection(5);
        } else if (keysDepressed.current.s) {
          return selectNoteDirection(7);
        } else {
          return selectNoteDirection(3);
        }
      }
      case 'KeyF': {
        if (ev.shiftKey) {
          return;
        }

        return selectNoteDirection(8);
      }

      case 'KeyZ': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        return ev.shiftKey ? redoNotes() : undoNotes();
      }

      case 'Numpad1': {
        return selectNoteDirection(6);
      }
      case 'Numpad2': {
        return selectNoteDirection(1);
      }
      case 'Numpad3': {
        return selectNoteDirection(7);
      }
      case 'Numpad4': {
        return selectNoteDirection(2);
      }
      case 'Numpad5': {
        return selectNoteDirection(8);
      }
      case 'Numpad6': {
        return selectNoteDirection(3);
      }
      case 'Numpad7': {
        return selectNoteDirection(4);
      }
      case 'Numpad8': {
        return selectNoteDirection(0);
      }
      case 'Numpad9': {
        return selectNoteDirection(5);
      }

      default:
        return;
    }
  };

  const handleKeyUp = ev => {
    switch (ev.code) {
      case 'Space': {
        keysDepressed.current.space = false;
        break;
      }
      case 'KeyW': {
        keysDepressed.current.w = false;
        break;
      }
      case 'KeyA': {
        keysDepressed.current.a = false;
        break;
      }
      case 'KeyS': {
        keysDepressed.current.s = false;
        break;
      }
      case 'KeyD': {
        keysDepressed.current.d = false;
        break;
      }

      default:
        return;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // While not a key exactly, we also want to manage the mousewheel+ctrl
  // action of changing the snapping
  useMousewheel({ current: window }, false, ev => {
    if (!isMetaKeyPressed(ev)) {
      return;
    }

    const direction = ev.deltaY > 0 ? 'forwards' : 'backwards';

    direction === 'forwards' ? incrementSnapping() : decrementSnapping();
  });

  return null;
};

const mapDispatchToProps = {
  togglePlaying: actions.togglePlaying,
  scrollThroughSong: actions.scrollThroughSong,
  deleteSelectedNotes: actions.deleteSelectedNotes,
  changeSnapping: actions.changeSnapping,
  incrementSnapping: actions.incrementSnapping,
  decrementSnapping: actions.decrementSnapping,
  selectNextTool: actions.selectNextTool,
  selectPreviousTool: actions.selectPreviousTool,
  selectTool: actions.selectTool,
  deselectAll: actions.deselectAll,
  selectNoteDirection: actions.selectNoteDirection,
  copySelectedNotes: actions.copySelectedNotes,
  cutSelectedNotes: actions.cutSelectedNotes,
  pasteSelectedNotes: actions.pasteSelectedNotes,
  undoNotes: actions.undoNotes,
  redoNotes: actions.redoNotes,
  swapSelectedNotes: actions.swapSelectedNotes,
  toggleSelectAll: actions.toggleSelectAll,
  jumpToBar: actions.jumpToBar,
  skipToStart: actions.skipToStart,
  skipToEnd: actions.skipToEnd,
};

export default connect(
  null,
  mapDispatchToProps
)(KeyboardShortcuts);
