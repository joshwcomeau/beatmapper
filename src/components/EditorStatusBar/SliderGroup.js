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
}) => (
  <Wrapper>
    <StatusIcon icon={minIcon} onClick={() => onChange(min)} />
    <Spacer size={UNIT} />
    <MiniSlider
      width={width}
      height={height}
      min={min}
      max={max}
      step={typeof step === 'number' ? step : 1 / width}
      value={value}
      onChange={ev => onChange(ev.target.value)}
    />
    <Spacer size={UNIT} />
    <StatusIcon icon={maxIcon} onClick={() => onChange(max)} />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
`;

export default SliderGroup;
