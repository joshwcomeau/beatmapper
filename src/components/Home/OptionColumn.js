import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';

import { COLORS, UNIT } from '../../constants';

import Heading from '../Heading';
import Button from '../Button';
import Spacer from '../Spacer';
import Paragraph from '../Paragraph';

const OptionColumn = ({
  icon,
  title,
  disabled,
  description,
  buttonText,
  handleClick,
}) => {
  return (
    <Wrapper>
      <Icon icon={icon} size={24} />
      <Spacer size={UNIT * 4} />
      <Title size={3}>{title}</Title>
      <Spacer size={UNIT * 2} />
      <Description>{description}</Description>
      <Spacer size={UNIT * 4} />
      <Button onClick={handleClick} disabled={disabled}>
        {buttonText}
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${COLORS.blueGray[300]};
  margin-bottom: ${UNIT * 5}px;
`;

const Title = styled(Heading)`
  color: ${COLORS.white};
`;

const Description = styled(Paragraph)`
  color: ${COLORS.blueGray[300]};
  text-align: center;
`;

export default OptionColumn;
