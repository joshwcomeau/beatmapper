import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

import Spacer from '../Spacer';
import MiniSlider from '../MiniSlider';

import StatusIcon from './StatusIcon';

const SliderGroup = ({
  width,
  height,
  minIcon,
  maxIcon,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
  ...delegated
}) => (
  <Wrapper>
    <StatusIcon
      disabled={disabled}
      icon={minIcon}
      onClick={() => onChange(min)}
    />
    <Spacer size={UNIT} />
    <MiniSlider
      width={width}
      height={height}
      min={min}
      max={max}
      step={typeof step === 'number' ? step : 1 / width}
      value={value}
      onChange={ev => onChange(Number(ev.target.value))}
      disabled={disabled}
      {...delegated}
    />
    <Spacer size={UNIT} />
    <StatusIcon
      disabled={disabled}
      icon={maxIcon}
      onClick={() => onChange(max)}
    />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
`;

export default SliderGroup;
