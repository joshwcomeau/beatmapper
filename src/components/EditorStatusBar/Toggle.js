import React from 'react';
import styled from 'styled-components';

import { COLORS, UNIT } from '../../constants';

import Spacer from '../Spacer';
import UnfocusedButton from '../UnfocusedButton';
import StatusIcon from './StatusIcon';

const Toggle = ({ size, onIcon, offIcon, value, onChange }) => {
  const padding = 2;
  const borderWidth = 1;

  const side = value === true ? 'right' : 'left';

  return (
    <Wrapper>
      <StatusIcon
        size={14}
        opacity={value ? 0.5 : 1}
        icon={offIcon}
        onClick={ev => {
          onChange(false);
        }}
      />
      <Spacer size={UNIT} />

      <ToggleWrapper
        style={{
          width: size * 2 + padding * 2 + borderWidth * 2,
          height: size + padding * 2 + borderWidth * 2,
          padding,
          borderWidth,
        }}
        onClick={ev => {
          onChange(!value);
        }}
      >
        <Ball style={{ [side]: padding, width: size, height: size }} />
      </ToggleWrapper>
      <Spacer size={UNIT} />
      <StatusIcon
        size={14}
        opacity={value ? 1 : 0.5}
        icon={onIcon}
        onClick={ev => {
          onChange(true);
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleWrapper = styled(UnfocusedButton)`
  position: relative;
  border-color: ${COLORS.blueGray[500]};
  border-style: solid;
  border-radius: 500px;
  cursor: pointer;
`;

const Ball = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  background: ${COLORS.blueGray[100]};
`;

export default Toggle;
