import React from 'react';
import styled, { keyframes } from 'styled-components';
import Icon from 'react-icons-kit';
import { x } from 'react-icons-kit/feather/x';
import Color from 'color';

import { UNIT, COLORS } from '../../constants';

import Heading from '../Heading';
import Spacer from '../Spacer';
import UnstyledButton from '../UnstyledButton';

const UnobtrusivePrompt = ({ title, children, onDismiss }) => {
  return (
    <Wrapper>
      <CloseButton onClick={onDismiss}>
        <Icon icon={x} size={24} />
      </CloseButton>
      <Heading size={2}>{title}</Heading>
      <Spacer size={UNIT * 3} />
      <Contents>{children}</Contents>
    </Wrapper>
  );
};

const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 999;
  max-width: 400px;
  background: ${Color(COLORS.blueGray[900])
    .fade(0.1)
    .string()};
  top: ${UNIT * 2}px;
  right: ${UNIT * 2}px;
  padding: ${UNIT * 3}px;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.8);
  animation: ${enterAnimation} 500ms 1000ms both ease-out;
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: ${UNIT * 2}px;
  right: ${UNIT * 2}px;
`;

const Contents = styled.div`
  & p,
  & li {
    font-size: 16px;
    font-family: 'system';
    line-height: 1.5;
  }

  p:not(:last-of-type) {
    margin-bottom: ${UNIT * 2}px;
  }
`;

export default UnobtrusivePrompt;
