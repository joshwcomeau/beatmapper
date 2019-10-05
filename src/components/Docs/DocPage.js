import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import MdxWrapper from './MdxWrapper';
import TableOfContents from './TableOfContents';

const DocPage = ({ title, subtitle, tableOfContents, children }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      <HorizontalRule />

      <Row>
        <MainContent>
          <MdxWrapper>{children}</MdxWrapper>
        </MainContent>
        <TableOfContents title={title} toc={tableOfContents} />
      </Row>
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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const MainContent = styled.div`
  flex: 1;
`;

export default DocPage;
