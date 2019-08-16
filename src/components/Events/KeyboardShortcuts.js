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
  selectNextTool,
  selectPreviousTool,
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
        // TODO: Implement this
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

      case 'Delete': {
        // TODO
        break;
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
        if (!isMetaKeyPressed(ev)) {
          return;
        }

        ev.preventDefault();
        return toggleSelectAll(EVENTS_VIEW);
      }

      case 'KeyZ': {
        // TODO
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
  changeSnapping: actions.changeSnapping,
  incrementSnapping: actions.incrementSnapping,
  decrementSnapping: actions.decrementSnapping,
  selectNextTool: actions.selectNextTool,
  selectPreviousTool: actions.selectPreviousTool,
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
};

export default connect(
  null,
  mapDispatchToProps
)(KeyboardShortcuts);
