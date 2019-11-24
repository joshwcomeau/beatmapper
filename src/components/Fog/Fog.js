import React from 'react';
import { connect } from 'react-redux';
import { getGraphicsLevel } from '../../reducers/user.reducer';

const Fog = ({ renderForGraphics, graphicsLevel, strength }) => {
  if (graphicsLevel !== renderForGraphics) {
    return null;
  }

  return <fogExp2 attach="fog" args={[0x000000, strength]} />;
};

const mapStateToProps = state => {
  return {
    graphicsLevel: getGraphicsLevel(state),
  };
};

export default connect(mapStateToProps)(Fog);
