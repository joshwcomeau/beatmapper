import React from 'react';
import styled from 'styled-components';

const FOOTER_HEIGHT = 100;

const Footer = () => {
  return (
    <>
      <Wrapper style={{ height: FOOTER_HEIGHT }} />
      <Blocker style={{ height: FOOTER_HEIGHT }} />
    </>
  );
};

const Wrapper = styled.footer`
  background: hsla(0, 0%, 92%, 0.05);
`;

const Blocker = styled.div`
  position: relative;
  z-index: -1;
`;

export default Footer;
