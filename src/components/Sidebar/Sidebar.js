import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { home } from 'react-icons-kit/feather/home';
import { box } from 'react-icons-kit/feather/box';
import { sun } from 'react-icons-kit/feather/sun';
import { sliders } from 'react-icons-kit/feather/sliders';
import { download } from 'react-icons-kit/feather/download';

import { COLORS, UNIT, SIDEBAR_WIDTH } from '../../constants';
import * as actions from '../../actions';

import SpacedChildren from '../SpacedChildren';
import Spacer from '../Spacer';
import SidebarNavItem from './SidebarNavItem';

const Sidebar = ({ location, match, leaveEditor }) => {
  const { songId, difficulty } = match.params;

  return (
    <Wrapper>
      <Spacer size={UNIT * 2} />
      <SidebarNavItem icon={home} to="/" onClick={leaveEditor} />

      <Spacer size={UNIT * 2} />
      <Divider />
      <Spacer size={UNIT * 2} />

      <SpacedChildren spacing={UNIT * 2}>
        <SidebarNavItem
          title="Notes"
          icon={box}
          to={`/edit/${songId}/${difficulty}/notes`}
          isActive={!!location.pathname.match(/\/notes$/)}
        />
        <SidebarNavItem
          title="Events"
          icon={sun}
          to={`/edit/${songId}/${difficulty}/events`}
          isActive={!!location.pathname.match(/\/events$/)}
        />
        <SidebarNavItem
          title="Song Details"
          icon={sliders}
          to={`/edit/${songId}/${difficulty}/details`}
          isActive={!!location.pathname.match(/\/details$/)}
        />
        <SidebarNavItem
          title="Download"
          icon={download}
          to={`/edit/${songId}/${difficulty}/download`}
          isActive={!!location.pathname.match(/\/download$/)}
        />
      </SpacedChildren>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: ${COLORS.blueGray[700]};
  user-select: none;
`;

const Divider = styled.div`
  height: 0px;
  width: 80%;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.25);
`;

const mapDispatchToProps = {
  leaveEditor: actions.leaveEditor,
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Sidebar)
);
