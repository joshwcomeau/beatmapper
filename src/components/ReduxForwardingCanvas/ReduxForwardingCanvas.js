import React from 'react';
import { Provider, ReactReduxContext } from 'react-redux';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';

const ReduxForwardingCanvas = React.forwardRef(
  ({ children, ...forwarded }, ref) => {
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <span ref={ref}>
            <Canvas
              {...forwarded}
              pixelRatio={window.devicePixelRatio || 1}
              onContextMenu={ev => {
                // Don't allow context menu to pop on right click.
                // I need that for deleting notes and stuff.
                ev.preventDefault();
              }}
              onCreated={({ gl }) => {
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
              }}
            >
              <Provider store={store}>{children}</Provider>
            </Canvas>
          </span>
        )}
      </ReactReduxContext.Consumer>
    );
  }
);

export default ReduxForwardingCanvas;
