import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { EVENTS_VIEW } from '../../constants';
import { isMetaKeyPressed } from '../../utils';

const KeyboardShortcuts = ({
  selectTool,
  selectEventEditMode,
  toggleSelectAll,
  zoomOut,
  zoomIn,
  toggleEventWindowLock,
  toggleLaserLock,
}) => {
  const handleKeyDown = ev => {
    switch (ev.code) {
      case 'NumpadSubtract':
      case 'Minus': {
        return zoomOut();
      }
      case 'Equal': {
        if (ev.shiftKey) {
          // Shift+Equal is "Plus"
          return zoomIn();
        }

        break;
      }
      case 'NumpadAdd': {
        return zoomIn();
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

      case 'KeyZ': {
        if (isMetaKeyPressed(ev)) {
          return;
        }

        ev.stopPropagation();
        return toggleEventWindowLock();
      }

      case 'KeyX': {
        if (isMetaKeyPressed(ev)) {
          return;
        }

        ev.stopPropagation();
        return toggleLaserLock();
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

      default:
        return;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return null;
};

const mapDispatchToProps = {
  selectTool: actions.selectTool,
  selectEventEditMode: actions.selectEventEditMode,
  toggleSelectAll: actions.toggleSelectAll,
  zoomOut: actions.zoomOut,
  zoomIn: actions.zoomIn,
  toggleEventWindowLock: actions.toggleEventWindowLock,
  toggleLaserLock: actions.toggleLaserLock,
};

export default connect(
  null,
  mapDispatchToProps
)(KeyboardShortcuts);
