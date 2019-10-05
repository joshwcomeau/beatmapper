import React from 'react';
import styled from 'styled-components';
import { NavLink as NavLinkRaw } from 'react-router-dom';

import { COLORS } from '../../constants';

import Logo from '../Logo';
import NavGroup from './NavGroup';

const Sidebar = () => {
  return (
    <Wrapper>
      <Header>
        <Logo color="#000" />
      </Header>
      <Navigation>
        <NavGroup>
          <NavLink exact to="/docs">
            About
          </NavLink>
        </NavGroup>
        <NavGroup title="User Manual" showByDefault>
          <NavLink to="/docs/getting-started">Getting started</NavLink>
          <NavLink to="/docs/notes">Notes view</NavLink>
          <NavLink to="/docs/events">Events view</NavLink>
          <NavLink to="/docs/packaging">Downloading and publishing</NavLink>
        </NavGroup>
        <NavGroup>
          <NavLink to="/docs/keyboard-shortcuts">Keyboard shortcuts</NavLink>
          <NavLink to="/docs/content-policy">Content policy</NavLink>
          <NavLink to="/docs/privacy">Privacy</NavLink>
        </NavGroup>
      </Navigation>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  border-right: 1px solid ${COLORS.blueGray[100]};
`;

const Navigation = styled.nav`
  padding-left: 12px;
`;

const NavLink = styled(NavLinkRaw).attrs(props => ({
  activeStyle: {
    color: COLORS.blue[500],
  },
}))`
  display: flex;
  align-items: center;
  height: 35px;
  color: ${COLORS.blueGray[700]};
  font-family: 'system';
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    color: ${COLORS.blueGray[400]};
  }
`;

const ActiveNavLink = styled(NavLink)`
  color: ${COLORS.blue[500]};
`;

const Header = styled.header`
  height: 80px;
  border-bottom: 1px solid ${COLORS.blueGray[100]};
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

export default Sidebar;
