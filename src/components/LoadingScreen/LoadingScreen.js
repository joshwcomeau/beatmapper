import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Spinner from '../Spinner';

const LoadingScreen = () => {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${COLORS.gray[900]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LoadingScreen;
