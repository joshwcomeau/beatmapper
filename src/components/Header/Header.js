import React from 'react';
import styled from 'styled-components';

import { HEADER_HEIGHT } from '../../constants';

import MaxWidthWrapper from '../MaxWidthWrapper';
import Logo from '../Logo';

const Header = () => {
  return (
    <Wrapper>
      <MaxWidthWrapper>
        <Contents>
          <Logo />
        </Contents>
      </MaxWidthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: ${HEADER_HEIGHT}px;
  line-height: ${HEADER_HEIGHT}px;
  background: hsla(222, 10%, 92%, 0.025);
`;

const Contents = styled.div`
  display: flex;
`;

export default Header;
