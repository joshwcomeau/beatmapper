import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { UNIT, COLORS } from '../../constants';

import UnfocusedButton from '../UnfocusedButton';
import PixelShifter from '../PixelShifter';

const MiniButton = ({
  children,
  color,
  hoverColor,
  as,
  width,
  style = {},
  ...delegated
}) => {
  let renderAs =
    as || (typeof delegated.to === 'string' ? Link : UnfocusedButton);

  return (
    <ButtonElem
      as={renderAs}
      {...delegated}
      color={color}
      hover-color={hoverColor}
      style={{ ...style, width }}
    >
      {typeof children === 'string' ? (
        <PixelShifter y={-1}>{children}</PixelShifter>
      ) : (
        children
      )}
    </ButtonElem>
  );
};

const ButtonElem = styled(UnfocusedButton)`
  position: relative;
  padding: ${UNIT / 2}px ${UNIT * 1.5}px;
  border-radius: ${UNIT}px;
  font-size: 14px;
  background: ${props => props.color || 'hsla(0, 0%, 100%, 9%)'};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.white};
  text-decoration: none;

  &:hover:not(:disabled) {
    background: ${props =>
      props['hover-color'] || 'hsla(0, 0%, 100%, 14%) !important'};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export default MiniButton;
