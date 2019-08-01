import styled from 'styled-components';

const PixelShifter = styled.div`
  transform: ${props => `translate(${props.x || 0}px, ${props.y || 0}px)}`};
`;

export default PixelShifter;
