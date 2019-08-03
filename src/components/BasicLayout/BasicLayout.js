import React from 'react';
import styled from 'styled-components';

import { UNIT, HEADER_HEIGHT, FOOTER_HEIGHT } from '../../constants';

import Header from '../Header';
import Footer from '../Footer';
import Spacer from '../Spacer';

const HEADER_SPACING = UNIT * 8;

const BasicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Spacer size={HEADER_SPACING} />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
};

const MainContent = styled.div`
  min-height: calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT + HEADER_SPACING}px);
`;

export default BasicLayout;
