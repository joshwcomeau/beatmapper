import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

const DocPage = ({ title, subtitle, children }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      <HorizontalRule />

      <DocWrapper>{children}</DocWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 45px 60px;
  font-family: 'system';
`;

const Title = styled.div`
  font-size: 38px;
  color: ${COLORS.blueGray[900]};
  font-weight: 900;
  margin-bottom: 12px;
  /* font-family: 'Raleway'; */
`;

const Subtitle = styled.div`
  font-size: 28px;
  color: ${COLORS.blueGray[500]};
  font-weight: 500;
`;

const HorizontalRule = styled.hr`
  background: ${COLORS.blueGray[200]};
  border: none;
  height: 1px;
  margin: 25px 0;
`;

const DocWrapper = styled.div`
  line-height: 1.4;

  p {
    font-size: 18px;
    color: ${COLORS.blueGray[900]};
    margin-bottom: 24px;
  }

  a {
    color: ${COLORS.blue[700]};
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: ${COLORS.blue[500]};
      text-decoration: underline;
    }
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  h1,
  h2,
  h3,
  h4 {
    margin-top: 36px;
    margin-bottom: 12px;
  }

  h1 {
    font-size: 32px;
    font-weight: 700;
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
  }

  h3 {
    font-size: 24px;
    font-weight: 700;
  }

  h4 {
    font-size: 18px;
    font-weight: 700;
  }

  li {
    margin-left: 20px;
    list-style-type: circle;
    margin-bottom: 18px;
  }
`;

export default DocPage;
