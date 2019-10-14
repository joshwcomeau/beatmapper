/*
  A Select, styled to look like our TextInput component
*/
import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import { COLORS } from '../../constants';

const DropdownInput = ({
  label,
  children,
  value,
  displayValue,
  ...delegated
}) => {
  const displayedText = displayValue || value;

  return (
    <Label>
      <LabelText>{label}</LabelText>
      <Input value={displayedText} onChange={() => {}} />

      <Caret>
        <Icon icon={chevronDown} size={16} />
      </Caret>

      <Select value={value} {...delegated}>
        {children}
      </Select>
    </Label>
  );
};

const Input = styled.input`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 36px;
  padding: 0;
  /* border-radius: 6px; */
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  color: ${COLORS.white};
  font-size: 16px;
  outline: none;

  &:focus {
    border-bottom: 2px solid ${COLORS.pink[500]};
  }

  ::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const Label = styled.label`
  position: relative;
  display: block;
`;

const LabelText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: ${COLORS.gray[100]};
  margin-bottom: 4px;
`;

const Caret = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 16px;
  height: 16px;
  color: ${COLORS.white};
`;

const Select = styled.select`
  opacity: 0;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export default DropdownInput;
