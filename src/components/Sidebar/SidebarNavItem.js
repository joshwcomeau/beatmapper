import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import Icon from 'react-icons-kit';

import { COLORS, UNIT, SIDEBAR_WIDTH } from '../../constants';

import BaseLink from '../BaseLink';

const SidebarNavItem = ({
  isActive,
  title,
  icon,
  to,
  onClick,
  ...delegated
}) => {
  return (
    <Tooltip
      disabled={!title}
      title={title}
      position="right"
      delay={[500, 0]}
      distance={UNIT * 2}
      animateFill={false}
    >
      <Wrapper>
        <ActiveIndicator
          style={{ transform: isActive ? 'translateX(0)' : 'translateX(-4px)' }}
        />
        <LinkElem
          to={to}
          style={{
            color: isActive
              ? 'rgba(255, 255, 255, 1)'
              : 'rgba(255, 255, 255, 0.65)',
          }}
          onClick={onClick}
          {...delegated}
        >
          <Icon icon={icon} size={20} />
        </LinkElem>
      </Wrapper>
    </Tooltip>
  );
};

const SIZE = SIDEBAR_WIDTH - UNIT * 2;

const ActiveIndicator = styled.div`
  position: absolute;
  top: 4px;
  left: -${UNIT}px;
  bottom: 4px;
  width: 4px;
  background: ${COLORS.pink[500]};
  border-radius: 0 4px 4px 0;
  transition: transform 300ms;
`;

const Wrapper = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const LinkElem = styled(BaseLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export default SidebarNavItem;
