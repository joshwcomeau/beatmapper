import React from 'react';
import styled from 'styled-components';

import Spinner from '../Spinner';

const CenteredSpinner = props => {
  return (
    <Wrapper>
      <Spinner {...props} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CenteredSpinner;
