import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

const KeyIcon = ({ size = 'medium', children }) => {
  const isWideKey = typeof children === 'string' && children.length > 1;
  const Component = isWideKey ? WideKey : SquareKey;

  return <Component size={size}>{children}</Component>;
};

const Key = styled.div`
  height: ${props => (props.size === 'medium' ? 27 : 18)}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  background: ${COLORS.blueGray[100]};
  border-bottom: 3px solid ${COLORS.blueGray[300]};
  border-radius: 3px;
  font-size: ${props => (props.size === 'medium' ? 12 : 10)}px;
  color: ${COLORS.gray[900]};
  cursor: default;
`;

const SquareKey = styled(Key)`
  width: ${props => (props.size === 'medium' ? 24 : 15)}px;
`;

const WideKey = styled(Key)`
  padding-left: 16px;
  padding-right: 16px;
`;

export default KeyIcon;
