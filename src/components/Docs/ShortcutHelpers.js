import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';

import { COLORS } from '../../constants';
import { getMetaKeyLabel } from '../../utils';

export const KeyIcon = ({ size = 'medium', children }) => {
  const isWideKey = typeof children === 'string' && children.length > 1;

  // prettier-ignore
  let Component = children === 'Space'
    ? UltraWideKey
    : children.length > 1 || typeof children !== 'string'
      ? WideKey
      : SquareKey

  return <Component size={size}>{children}</Component>;
};

export const Plus = () => (
  <PlusWrapper>
    <Icon icon={plus} size={16} />
  </PlusWrapper>
);

export const MetaKey = () => {
  return getMetaKeyLabel();
};

export const IconRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }

  & > * {
    margin-right: 4px;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export const InlineIcons = styled(IconRow)`
  display: inline-flex;
  padding: 0 4px;
  transform: translateY(-2px);
`;
export const Sidenote = styled.div`
  font-size: 14px;
  font-weight: 300;
  margin-top: 8px;
  line-height: 1.3;
`;

export const Or = ({ children = 'or' }) => <OrWrapper>{children}</OrWrapper>;

export const OrWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 48px;
  text-transform: uppercase;
  opacity: 0.5;

  &::before {
    content: '—';
  }

  &::after {
    content: '—';
  }
`;

const PlusWrapper = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
`;

const Key = styled.div`
  height: ${props => (props.size === 'medium' ? 27 : 18)}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  background: ${COLORS.blueGray[100]};
  border-bottom: 3px solid ${COLORS.blueGray[300]};
  border-radius: 3px;
  font-size: ${props => (props.size === 'medium' ? 12 : 10)}px;
  color: ${COLORS.gray[900]};
  cursor: default;
  margin-bottom: 4px;
`;

const SquareKey = styled(Key)`
  width: ${props => (props.size === 'medium' ? 24 : 15)}px;
`;

const WideKey = styled(Key)`
  padding-left: 16px;
  padding-right: 16px;
`;

const UltraWideKey = styled(Key)`
  padding-left: 32px;
  padding-right: 32px;
`;
