import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

import Heading from '../Heading';
import Spacer from '../Spacer';

const ControlItem = ({ label, children, isExpandable }) => {
  return (
    <Wrapper>
      <Heading size={4}>{label}</Heading>
      <Spacer size={UNIT} />

      <ChildrenWrapper>
        {React.Children.map(children, (child, i) => (
          <React.Fragment key={label}>
            {child}
            {i < children.length - 1 && <Spacer size={UNIT} />}
          </React.Fragment>
        ))}
      </ChildrenWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const ChildrenWrapper = styled.div`
  display: flex;
`;

export default ControlItem;
