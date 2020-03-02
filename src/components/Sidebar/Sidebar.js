import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { home } from 'react-icons-kit/feather/home';
import { box } from 'react-icons-kit/feather/box';
import { sun } from 'react-icons-kit/feather/sun';
import { sliders } from 'react-icons-kit/feather/sliders';
import { download } from 'react-icons-kit/feather/download';
import { helpCircle } from 'react-icons-kit/feather/helpCircle';
import { settings } from 'react-icons-kit/feather/settings';
import { play } from 'react-icons-kit/feather/play';

import { COLORS, UNIT, SIDEBAR_WIDTH } from '../../constants';

import SpacedChildren from '../SpacedChildren';
import Spacer from '../Spacer';
import SettingsModal from '../SettingsModal';
import SidebarNavItem from './SidebarNavItem';

const Sidebar = ({ location, match }) => {
  const { songId, difficulty } = match.params;

  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  return (
    <>
      <SettingsModal
        isVisible={showSettingsModal}
        onDismiss={() => {
          setShowSettingsModal(false);
        }}
      />

      <Wrapper>
        <Top>
          <Spacer size={UNIT * 2} />
          <SidebarNavItem icon={home} to="/" />

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
              title="Preview"
              icon={play}
              to={`/edit/${songId}/${difficulty}/preview`}
              isActive={!!location.pathname.match(/\/preview$/)}
            />
            <SidebarNavItem
              title="Map settings"
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
        </Top>

        <Bottom>
          <SpacedChildren spacing={UNIT * 2}>
            <SidebarNavItem
              title="App settings"
              icon={settings}
              onClick={ev => {
                ev.preventDefault();
                setShowSettingsModal(true);
              }}
              isActive={false}
            />
            <SidebarNavItem
              title="Help"
              icon={helpCircle}
              to="/docs"
              isActive={false}
              target="_blank"
            />
          </SpacedChildren>
        </Bottom>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: ${SIDEBAR_WIDTH}px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${COLORS.blueGray[700]};
  user-select: none;
`;

const Top = styled.div``;

const Bottom = styled.div``;

const Divider = styled.div`
  height: 0px;
  width: 80%;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.25);
`;

export default withRouter(Sidebar);
