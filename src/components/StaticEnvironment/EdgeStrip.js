import React from 'react';
import { connect } from 'react-redux';

import RectAreaLight from '../RectAreaLight';

const EdgeStrip = ({ x, y, z, width = 0.1, depth = 50, renderAs }) => {
  // This strip can either be a RectAreaLight, to cast on the blocks, or it can
  // be a simple plane. This is dependent on the performance tuning. Because
  // hooks can't be conditional, I always need to create a value for lookAt.
  if (renderAs === 'light') {
    const lookAt = [x, y + 10, z];

    return (
      <RectAreaLight
        intensity={0.8}
        width={width}
        height={depth}
        position={[x, y, z]}
        lookAt={lookAt}
      />
    );
  } else {
    return (
      <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry attach="geometry" args={[width, depth]} />
        <meshStandardMaterial attach="material" color="#FFF" />
      </mesh>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  // TODO: Replace this with redux state
  const performance = {
    setting: 'high',
  };

  const renderAs = performance.setting === 'high' ? 'light' : 'plane';

  return { renderAs };
};

export default connect(mapStateToProps)(EdgeStrip);
