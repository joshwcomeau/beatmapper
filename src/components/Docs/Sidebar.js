import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { COLORS } from '../../constants';

import Logo from '../Logo';

const Sidebar = () => {
  return (
    <Wrapper>
      <Header>
        <Logo color="#000" />
      </Header>
      <Navigation>
        <NavLink to="/docs">About</NavLink>
        <NavGroup title="User Manual">
          <NavLink to="/docs/getting-started">Getting started</NavLink>
          <NavLink to="/docs/notes">Notes view</NavLink>
          <NavLink to="/docs/events">Events view</NavLink>
          <NavLink to="/docs/packaging">Downloading and publishing</NavLink>
        </NavGroup>
        <NavLink to="/docs/keyboard-shortcuts">Keyboard shortcuts</NavLink>
      </Navigation>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  border-right: 1px solid ${COLORS.blueGray[100]};
`;

const Navigation = styled.nav``;

const Header = styled.header`
  height: 80px;
  border-bottom: 1px solid ${COLORS.blueGray[100]};
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const NavGroup = styled.div``;

export default Sidebar;
