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
`;

const SidebarWrapper = styled.div`
  width: 300px;
  height: 100%;
  background: ${COLORS.blueGray[100]};
  border-right: 1px solid ${COLORS.blueGray[300]};
`;

const MainContent = styled.div`
  flex: 1;
`;

export default Layout;
