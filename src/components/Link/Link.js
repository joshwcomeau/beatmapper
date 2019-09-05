import styled from 'styled-components';

import { COLORS } from '../../constants';

import BaseLink from '../BaseLink';

export default styled(BaseLink)`
  color: ${COLORS.yellow[500]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
