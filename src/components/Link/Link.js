import styled from 'styled-components';
import { Link as RRLink } from 'react-router-dom';

import { COLORS } from '../../constants';

export default styled(RRLink)`
  color: ${COLORS.yellow[500]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
