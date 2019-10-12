import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Sidebar from './Sidebar';
import SearchHeader from './SearchHeader';

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <MainContent>
        <SearchHeader />
        {children}
      </MainContent>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: #fff;
  color: #000;
`;

const SidebarWrapper = styled.div`
  width: 300px;
  border-right: 1px solid ${COLORS.blueGray[100]};
`;

const MainContent = styled.div`
  flex: 1;
`;

export default Layout;
