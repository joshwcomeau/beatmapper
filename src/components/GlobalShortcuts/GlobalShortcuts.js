/**
 * These are shortcuts that are shared among 3 views:
 * - Notes
 * - Events
 * - Demo
 */
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { SNAPPING_INCREMENTS, EVENTS_VIEW, NOTES_VIEW } from '../../constants';
import { throttle, isMetaKeyPressed } from '../../utils';
import useMousewheel from '../../hooks/use-mousewheel.hook';

const KeyboardShortcuts = ({
  view,
  togglePlaying,
  scrollThroughSong,
  changeSnapping,
  incrementSnapping,
  decrementSnapping,
  selectNextTool,
  selectPreviousTool,
  selectColor,
  deselectAll,
  copySelection,
  cutSelection,
  pasteSelection,
  jumpToBar,
  skipToStart,
  skipToEnd,
  undoNotes,
  redoNotes,
  undoEvents,
  redoEvents,
  deleteSelectedNotes,
  deleteSelectedEvents,
  seekForwards,
  seekBackwards,
}) => {
  let keysDepressed = React.useRef({
    space: false,
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
        return deselectAll(view);
      }

      case 'Tab': {
        ev.preventDefault();

        if (ev.shiftKey) {
          selectPreviousTool(view);
        } else {
          selectNextTool(view);
        }

        return;
      }

      case 'ArrowUp':
      case 'ArrowRight': {
        return throttledScroller('forwards');
      }
      case 'ArrowDown':
      case 'ArrowLeft': {
        return throttledScroller('backwards');
      }

      case 'PageDown': {
        return seekForwards(view);
      }
      case 'PageUp': {
        return seekBackwards(view);
      }

      case 'Home': {
        return skipToStart();
      }
      case 'End': {
        return skipToEnd();
      }

      case 'Delete': {
        if (view === EVENTS_VIEW) {
          return deleteSelectedEvents();
        } else if (view === NOTES_VIEW) {
          return deleteSelectedNotes();
        }

        return;
      }

      case 'KeyX': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        return cutSelection(view);
      }
      case 'KeyC': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return copySelection(view);
      }
      case 'KeyV': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return pasteSelection(view);
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

      case 'KeyR': {
        return selectColor(view, 'red');
      }
      case 'KeyB': {
        return selectColor(view, 'blue');
      }

      case 'KeyZ': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        if (view === NOTES_VIEW) {
          return ev.shiftKey ? redoNotes() : undoNotes();
        } else if (view === EVENTS_VIEW) {
          return ev.shiftKey ? redoEvents() : undoEvents();
        } else {
          return;
        }
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
  changeSnapping: actions.changeSnapping,
  incrementSnapping: actions.incrementSnapping,
  decrementSnapping: actions.decrementSnapping,
  selectNextTool: actions.selectNextTool,
  selectPreviousTool: actions.selectPreviousTool,
  selectColor: actions.selectColor,
  deselectAll: actions.deselectAll,
  copySelection: actions.copySelection,
  cutSelection: actions.cutSelection,
  pasteSelection: actions.pasteSelection,
  undoEvents: actions.undoEvents,
  redoEvents: actions.redoEvents,
  undoNotes: actions.undoNotes,
  redoNotes: actions.redoNotes,
  jumpToBar: actions.jumpToBar,
  skipToStart: actions.skipToStart,
  skipToEnd: actions.skipToEnd,
  deleteSelectedEvents: actions.deleteSelectedEvents,
  deleteSelectedNotes: actions.deleteSelectedNotes,
  seekForwards: actions.seekForwards,
  seekBackwards: actions.seekBackwards,
};

export default connect(
  null,
  mapDispatchToProps
)(KeyboardShortcuts);
