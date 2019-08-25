import React from 'react';
import { Icon } from 'react-icons-kit';
import styled from 'styled-components';

import { UNIT, COLORS } from '../../constants';

import UnfocusedButton from '../UnfocusedButton';

const IconButton = ({
  icon,
  style = {},
  isToggled,
  children,
  color,
  size = 36,
  rotation = 0,
  ...delegated
}) => {
  const iconSize = size / 2;

  return (
    <ButtonElem
      {...delegated}
      style={{
        ...style,
        width: size,
        height: size,
        color: color || (isToggled ? COLORS.white : COLORS.gray[300]),
        backgroundColor: isToggled ? 'hsla(0, 0%, 100%, 10%)' : 'transparent',
      }}
    >
      {children || (
        <Icon
          size={iconSize}
          icon={icon}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      )}
    </ButtonElem>
  );
};

const ButtonElem = styled(UnfocusedButton)`
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${UNIT}px;

  &:hover:not(:disabled) {
    background: hsla(0, 0%, 100%, 10%) !important;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export default IconButton;
