import styled from 'styled-components';
import { COLORS } from '../../constants';

const StrikethroughOnHover = styled.span`
  display: inline-block;
  position: relative;

  &:hover::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -2px;
    right: -2px;
    height: 3px;
    transform: rotate(-4deg);
    transform-origin: center center;
    border-radius: 2px;
    background: ${COLORS.red[500]};
  }
`;

export default StrikethroughOnHover;
