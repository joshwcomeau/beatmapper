import React from 'react';
import ReactDOM from 'react-dom';

import Modal from '../components/Modal';

let mountPoint;

export const renderImperativePrompt = (modalProps, generateChildren) => {
  if (!mountPoint) {
    mountPoint = window.document.createElement('div');
    window.document.body.appendChild(mountPoint);
  }

  const cleanup = () => {
    ReactDOM.unmountComponentAtNode(mountPoint);
  };

  return new Promise(resolve => {
    const triggerSuccess = data => {
      cleanup();
      resolve(data);
    };
    const triggerClose = () => {
      cleanup();
      resolve(false);
    };

    try {
      ReactDOM.render(
        <Modal {...modalProps} isVisible={true} onDismiss={triggerClose}>
          {generateChildren(triggerSuccess, triggerClose)}
        </Modal>,
        mountPoint
      );
    } catch (err) {
      console.error(err);
    }
  });
};
