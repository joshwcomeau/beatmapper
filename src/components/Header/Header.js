import React from 'react';
import styled from 'styled-components';
import BaseLink from '../BaseLink';

import { COLORS, HEADER_HEIGHT } from '../../constants';

import MaxWidthWrapper from '../MaxWidthWrapper';
import Logo from '../Logo';

const Header = () => {
  return (
    <Wrapper>
      <MaxWidthWrapper>
        <Contents>
          <Logo />
          <DocLink to="/docs">Documentation</DocLink>
        </Contents>
      </MaxWidthWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: ${HEADER_HEIGHT}px;
  line-height: ${HEADER_HEIGHT}px;
  background: ${COLORS.blueGray[900]};
`;

const Contents = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DocLink = styled(BaseLink)`
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

export default Header;
