import React from 'react';
import { Link as RRLink } from 'react-router-dom';

export const shouldUseAnchor = to =>
  !!(to.match(/^https?:\/\//i) || to.match(/^#/));

const BaseLink = ({ to = '', ...delegated }) => {
  if (shouldUseAnchor(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...delegated} />
    );
  } else {
    return <RRLink to={to} {...delegated} />;
  }
};

export default BaseLink;
