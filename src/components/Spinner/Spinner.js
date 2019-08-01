// TODO: Custom spinner!
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from 'react-icons-kit';
import { loader } from 'react-icons-kit/feather/loader';
import { COLORS } from '../../constants';

const Spinner = ({ size = 32 }) => {
  return (
    <Wrapper>
      <Icon icon={loader} size={size} />
    </Wrapper>
  );
};

const endlessRotation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled.div`
  display: inline-block;
  color: ${COLORS.white}
  opacity: 0.75;
  animation: ${endlessRotation} 2s linear infinite;

  & * {
    display: block !important;
  }
`;

export default Spinner;
