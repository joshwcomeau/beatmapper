import React from 'react';
import styled from 'styled-components';

import { DIFFICULTY_COLORS } from '../../constants';
import { getLabelForDifficulty } from '../../helpers/song.helpers';

import UnstyledButton from '../UnstyledButton';

import { Difficulty } from '../../types';

interface Props {
  difficulty: Difficulty;
  width?: number;
  onSelect: (difficulty: Difficulty) => void;
  disabled?: boolean;
  isSelected: boolean;
}

const noop = () => {};

const DifficultyTag = ({
  difficulty,
  width = 80,
  isSelected,
  onSelect = noop,
  disabled,
  ...delegated
}: Props) => {
  const difficultyColor = DIFFICULTY_COLORS[difficulty];

  const border = isSelected
    ? `2px solid ${difficultyColor}`
    : '2px solid rgba(255, 255, 255, 0.35)';

  const textColor = isSelected ? difficultyColor : '#FFF';

  return (
    <Wrapper
      disabled={disabled}
      style={{ width, border, color: textColor }}
      onClick={ev => {
        ev.preventDefault();

        onSelect(difficulty);
      }}
      {...delegated}
    >
      {getLabelForDifficulty(difficulty)}
    </Wrapper>
  );
};

const Wrapper = styled(UnstyledButton)`
  display: inline-block;
  padding: 4px 0 6px;
  text-align: center;
  color: #000;
  border-radius: 100px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
`;

export default DifficultyTag;
