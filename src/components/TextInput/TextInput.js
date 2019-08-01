import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const TextInput = ({ label, ...delegated }) => {
  return (
    <Label>
      <LabelText>{label}</LabelText>
      <Input {...delegated} />
    </Label>
  );
};

const Input = styled.input`
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
  display: block;
`;

const LabelText = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: ${COLORS.gray[100]};
  margin-bottom: 4px;
`;

export default TextInput;
