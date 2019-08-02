/**
 * Building a Slider component from scratch because
 */
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const MiniSlider = ({
  width,
  height,
  style = {},
  includeMidpointTick,
  ...delegated
}) => {
  return (
    <Wrapper style={{ width, height }}>
      {includeMidpointTick && <Tick />}
      <Input
        type="range"
        style={{
          width,
          height,
          ...style,
        }}
        {...delegated}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Tick = styled.div`
  position: absolute;
  z-index: 0;
  width: 1px;
  height: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::before,
  &::after {
    content: '';
    height: 4px;
    background: ${COLORS.blueGray[400]};
  }
`;

const Input = styled.input`
  position: relative;
  z-index: 1;
  margin: 0;
  background: transparent;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed !important;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    animate: 0.2s;
    box-shadow: 0px 0px 1px ${COLORS.blueGray[700]};
    background: ${COLORS.blueGray[400]};
    border-radius: 5px;
    border: 0px solid ${COLORS.blueGray[700]};
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px ${COLORS.blueGray[700]};
    border: 2px solid ${COLORS.blueGray[700]};
    height: 12px;
    width: 12px;
    border-radius: 12px;
    background: #ffffff;
    -webkit-appearance: none;
    margin-top: -5px;
  }
  &::-moz-range-track {
    width: 100%;
    height: 3px;
    animate: 0.2s;
    background: #ffffff;
    border-radius: 5px;
    border: 0px solid ${COLORS.blueGray[700]};
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px ${COLORS.blueGray[700]};
    border: 2px solid ${COLORS.blueGray[700]};
    height: 12px;
    width: 12px;
    border-radius: 12px;
    background: #ffffff;
  }
  &::-ms-track {
    width: 100%;
    height: 3px;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;

export default MiniSlider;
