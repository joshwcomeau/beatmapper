import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const Heading = ({ size, ...delegated }) => {
  const Elem = HeadingArr[size];
  return <Elem {...delegated} />;
};

const HeadingBase = styled.h4`
  font-family: 'Oswald', sans-serif;
  font-weight: 300;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${COLORS.gray[300]};
`;

const H1 = styled(HeadingBase)`
  font-size: 28px;
  letter-spacing: 2px;
`;
const H2 = styled(HeadingBase)`
  font-size: 24px;
  letter-spacing: 2px;
`;
const H3 = styled(HeadingBase)`
  font-size: 16px;
  letter-spacing: 1.5px;
`;
const H4 = styled(HeadingBase)`
  font-size: 12px;
  letter-spacing: 1px;
`;

const HeadingArr = [null, H1, H2, H3, H4];

export default Heading;
