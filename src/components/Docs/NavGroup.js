import React from 'react';
import styled, { keyframes } from 'styled-components';
import Icon from 'react-icons-kit';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import { COLORS } from '../../constants';

import UnstyledButton from '../UnstyledButton';

const NavGroup = ({ title, showByDefault, children }) => {
  const hasTitle = !!title;
  const alwaysShowChildren = !hasTitle;

  const [isToggled, setIsToggled] = React.useState(
    alwaysShowChildren || showByDefault
  );

  const iconRotateAmount = isToggled ? 180 : 0;

  return (
    <Wrapper>
      {hasTitle && (
        <Trigger onClick={() => setIsToggled(!isToggled)}>
          <Title>{title}</Title>
          <IconWrapper
            style={{
              transform: `rotateX(${iconRotateAmount}deg)`,
            }}
          >
            <Icon icon={chevronDown} size={18} />
          </IconWrapper>
          <Highlight />
        </Trigger>
      )}

      {isToggled && <ChildLinks animated={hasTitle}>{children}</ChildLinks>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-bottom: 1px solid ${COLORS.blueGray[100]};
  padding: 12px;
`;

const Trigger = styled(UnstyledButton)`
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${COLORS.blueGray[700]};
`;

const Title = styled.div`
  position: relative;
  z-index: 1;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  color: ${COLORS.blueGray[500]};
`;

const IconWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Highlight = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: -12px;
  right: -12px;
  bottom: 0;
  background: ${COLORS.blueGray[50]};
  border-radius: 4px;
  opacity: 0;

  ${Trigger}:hover & {
    opacity: 1;
  }
`;

const accordionKeyframes = keyframes`
from {
  opacity: 0;
  transform: translateY(-10px);
}
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ChildLinks = styled.div`
  animation: ${p => (p.animated ? accordionKeyframes : '')} 200ms;
`;

export default NavGroup;
