/**
 * NOTE: This file contains a lot of duplication from
 * NotesEditor/KeyboardShortcuts. It's probably a good idea to consolidate
 * "shared" bindings between them.
 */
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { SNAPPING_INCREMENTS, EVENTS_VIEW } from '../../constants';
import { throttle, isMetaKeyPressed } from '../../utils';
import useMousewheel from '../../hooks/use-mousewheel.hook';

const KeyboardShortcuts = ({
  togglePlaying,
  scrollThroughSong,
  changeSnapping,
  incrementSnapping,
  decrementSnapping,
  selectTool,
  selectNextTool,
  selectPreviousTool,
  selectEventColor,
  selectEventEditMode,
  deselectAll,
  toggleSelectAll,
  copySelection,
  cutSelection,
  pasteSelection,
  jumpToBar,
  skipToStart,
  skipToEnd,
  undoEvents,
  redoEvents,
  deleteSelectedEvents,
  zoomOut,
  zoomIn,
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
        return deselectAll(EVENTS_VIEW);
      }

      case 'Tab': {
        ev.preventDefault();

        if (ev.shiftKey) {
          selectPreviousTool(EVENTS_VIEW);
        } else {
          selectNextTool(EVENTS_VIEW);
        }

        return;
      }

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
      case 'Minus': {
        return zoomOut();
      }
      case 'Equal': {
        if (ev.shiftKey) {
          // Shift+Equal is "Plus"
          return zoomIn();
        }
      }

      case 'Delete': {
        return deleteSelectedEvents();
      }

      case 'KeyX': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        return cutSelection(EVENTS_VIEW);
      }
      case 'KeyC': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return copySelection(EVENTS_VIEW);
      }
      case 'KeyV': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }
        return pasteSelection(EVENTS_VIEW);
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

      case 'KeyA': {
        if (isMetaKeyPressed(ev)) {
          ev.preventDefault();
          return toggleSelectAll(EVENTS_VIEW);
        }

        return selectEventEditMode('place');
      }

      case 'KeyS': {
        return selectEventEditMode('select');
      }

      case 'KeyR': {
        return selectEventColor('red');
      }
      case 'KeyB': {
        return selectEventColor('blue');
      }

      case 'Digit1': {
        return selectTool(EVENTS_VIEW, 'on');
      }
      case 'Digit2': {
        return selectTool(EVENTS_VIEW, 'off');
      }
      case 'Digit3': {
        return selectTool(EVENTS_VIEW, 'flash');
      }
      case 'Digit4': {
        return selectTool(EVENTS_VIEW, 'fade');
      }

      case 'KeyZ': {
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        return ev.shiftKey ? redoEvents() : undoEvents();
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
  selectTool: actions.selectTool,
  selectNextTool: actions.selectNextTool,
  selectPreviousTool: actions.selectPreviousTool,
  selectEventColor: actions.selectEventColor,
  selectEventEditMode: actions.selectEventEditMode,
  deselectAll: actions.deselectAll,
  copySelection: actions.copySelection,
  cutSelection: actions.cutSelection,
  pasteSelection: actions.pasteSelection,
  undoEvents: actions.undoEvents,
  redoEvents: actions.redoEvents,
  toggleSelectAll: actions.toggleSelectAll,
  jumpToBar: actions.jumpToBar,
  skipToStart: actions.skipToStart,
  skipToEnd: actions.skipToEnd,
  deleteSelectedEvents: actions.deleteSelectedEvents,
  zoomOut: actions.zoomOut,
  zoomIn: actions.zoomIn,
};

export default connect(
  null,
  mapDispatchToProps
)(KeyboardShortcuts);
