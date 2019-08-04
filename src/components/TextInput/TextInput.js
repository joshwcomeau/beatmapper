import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import QuestionTooltip from '../QuestionTooltip';

const TextInput = ({ label, required, moreInfo, ...delegated }) => {
  return (
    <Label>
      <LabelText>
        <span>
          {label}
          {required && <Asterisk />}
        </span>
        {moreInfo && <QuestionTooltip>{moreInfo}</QuestionTooltip>}
      </LabelText>
      <Input required={required} {...delegated} />
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

  &:disabled {
    color: ${COLORS.blueGray[500]};
  }
`;

const Label = styled.label`
  display: block;
`;

const LabelText = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: ${COLORS.gray[100]};
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
`;

const Asterisk = styled.span`
  display: inline-block;
  color: ${COLORS.red[300]};
  padding-left: 4px;

  &:before {
    content: '*';
  }
`;

export default TextInput;
