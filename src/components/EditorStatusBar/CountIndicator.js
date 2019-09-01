import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { Tooltip } from 'react-tippy';

import { UNIT } from '../../constants';

import Spacer from '../Spacer';

const CountIndicator = ({ num, label, icon }) => {
  return (
    <Tooltip title={label} delay={250}>
      <Wrapper>
        <Icon icon={icon} size={12} style={{ transform: 'translateY(-2px)' }} />
        <Spacer size={UNIT} />
        <Count>{num}</Count>
      </Wrapper>
    </Tooltip>
  );
};

const Count = styled.div``;

const Wrapper = styled.div`
  display: flex;
  cursor: default;
`;

export default CountIndicator;
