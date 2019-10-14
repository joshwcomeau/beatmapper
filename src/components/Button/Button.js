import React from 'react';
import styled from 'styled-components';

import { UNIT, COLORS } from '../../constants';
import UnstyledButton from '../UnstyledButton';

const Button = ({ children, disabled, color, ...delegated }) => {
  return (
    <ButtonElem disabled={disabled} color={color || ''} {...delegated}>
      <ChildWrapper>{children}</ChildWrapper>
    </ButtonElem>
  );
};

const ButtonElem = styled(UnstyledButton)`
  position: relative;
  padding: ${UNIT}px ${UNIT * 6}px;
  border-radius: 100px; /* More than enough for rounded corners */
  background: ${props => props.color || COLORS.pink[700]};
  border: none;
  font-size: 16px;
  text-align: center;

  &:disabled {
    background: ${COLORS.gray[500]};
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 100px;
    border: 2px solid ${props => props.color || COLORS.pink[700]};
    opacity: 0;
    transition: opacity 500ms;
  }

  &:disabled::after {
    border: 2px solid ${COLORS.gray[500]};
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ChildWrapper = styled.div`
  /* Our Oswald font doesn't quite look vertically centered. Fix it. */
  transform: translateY(-1px);
`;

export default Button;
