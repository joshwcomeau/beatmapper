/**
 * Building a Slider component from scratch because
 */
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const MiniSlider = ({ width, height, style = {}, ...delegated }) => {
  return (
    <Input
      type="range"
      style={{
        width,
        height,
        ...style,
      }}
      {...delegated}
    />
  );
};

const Input = styled.input`
  margin: 0;
  background: transparent;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 1px ${COLORS.blueGray[700]};
    background: rgba(255, 255, 255, 0.4);
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
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px;
  }
  &::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
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
    cursor: pointer;
  }
  &::-ms-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;

export default MiniSlider;
