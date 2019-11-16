import React from 'react';
import { connect } from 'react-redux';
import { getGraphicsLevel } from '../../reducers/user.reducer';

const Fog = ({ graphicsLevel }) => {
  if (graphicsLevel !== 'high') {
    return null;
  }

  return <fogExp2 attach="fog" args={[0x000000, 0.02]} />;
};

const mapStateToProps = state => {
  return {
    graphicsLevel: getGraphicsLevel(state),
  };
};

export default connect(mapStateToProps)(Fog);
