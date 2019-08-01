import React from 'react';

import { UNIT } from '../../constants';
import Spacer from '../Spacer';

const SpacedChildren = ({ children, spacing = UNIT }) => {
  return React.Children.map(children, child => [
    child,
    <Spacer size={spacing} />,
  ]);
};

export default SpacedChildren;
