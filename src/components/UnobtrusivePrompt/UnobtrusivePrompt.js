import React from 'react';
import styled from 'styled-components';
import Icon from 'react-icons-kit';
import { x } from 'react-icons-kit/feather/x';

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

const Wrapper = styled.div`
  position: absolute;
  z-index: 999;
  max-width: 400px;
  background: ${COLORS.blueGray[900]};
  top: ${UNIT * 2}px;
  right: ${UNIT * 2}px;
  padding: ${UNIT * 3}px;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.8);
`;

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: ${UNIT * 2}px;
  right: ${UNIT * 2}px;
`;

const Contents = styled.div`
  font-size: 16px;

  p:not(:last-of-type) {
    margin-bottom: ${UNIT * 2};
  }
`;

export default UnobtrusivePrompt;
