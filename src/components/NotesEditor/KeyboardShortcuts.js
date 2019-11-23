import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { NOTES_VIEW } from '../../constants';
import { isMetaKeyPressed } from '../../utils';
import { getDefaultObstacleDuration } from '../../reducers/editor.reducer';

const KeyboardShortcuts = ({
  defaultObstacleDuration,
  selectTool,
  selectNoteDirection,
  swapSelectedNotes,
  toggleSelectAll,
}) => {
  let keysDepressed = React.useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const handleKeyDown = ev => {
    switch (ev.code) {
      case 'Digit1':
        // Ignore meta+number, since that's used for snapping intervals
        if (isMetaKeyPressed(ev)) {
          return;
        }
        return selectTool(NOTES_VIEW, 'left-block');
      case 'Digit2':
        if (isMetaKeyPressed(ev)) {
          return;
        }
        return selectTool(NOTES_VIEW, 'right-block');
      case 'Digit3':
        if (isMetaKeyPressed(ev)) {
          return;
        }
        return selectTool(NOTES_VIEW, 'mine');
      case 'Digit4':
        if (isMetaKeyPressed(ev)) {
          return;
        }
        return selectTool(NOTES_VIEW, 'obstacle');

      case 'KeyH': {
        return swapSelectedNotes('horizontal');
      }
      case 'KeyV': {
        // If the user is pasting with Meta+V, ignore.
        if (isMetaKeyPressed(ev)) {
          return;
        }
        return swapSelectedNotes('vertical');
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

  return null;
};

const mapStateToProps = state => {
  return {
    defaultObstacleDuration: getDefaultObstacleDuration(state),
  };
};

const mapDispatchToProps = {
  selectTool: actions.selectTool,
  selectNoteDirection: actions.selectNoteDirection,
  swapSelectedNotes: actions.swapSelectedNotes,
  toggleSelectAll: actions.toggleSelectAll,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardShortcuts);
