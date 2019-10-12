import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { UNIT, COLORS } from '../../constants';

import MdxWrapper from './MdxWrapper';
import TableOfContents from './TableOfContents';
import Spacer from '../Spacer';

import HorizontalRule from './HorizontalRule';

/**
 * When loading a new route, we want to scroll the user to the top of the page.
 * Unless a hash is explicitly provided, in which case we scroll them to the
 * appropriate section.
 */
const useScrollOnLoad = location => {
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
};

const DocPage = ({ title, subtitle, tableOfContents, children, location }) => {
  useScrollOnLoad(location);

  return (
    <>
      <Helmet>
        <title>Beatmapper docs - {title}</title>
      </Helmet>
      <Wrapper>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}

        <HorizontalRule />

        <Row>
          <MainContent>
            <MdxWrapper>{children}</MdxWrapper>
            <Spacer size={UNIT * 8} />
          </MainContent>
          <TableOfContents toc={tableOfContents} location={location} />
        </Row>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  padding: 45px 60px;
  font-family: 'system';
  max-width: 1250px;
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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const MainContent = styled.div`
  flex: 1;
`;

export default withRouter(DocPage);
