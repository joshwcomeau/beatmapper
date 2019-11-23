import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import BaseLink from '../BaseLink';
import Spacer from '../Spacer';
import HorizontalRule from './HorizontalRule';

const pages = [
  { id: 'getting-started', title: 'Getting started' },
  { id: 'navigating-the-editor', title: 'Navigating the Editor' },
  { id: 'notes-view', title: 'Notes View' },
  { id: 'events-view', title: 'Events View' },
  { id: 'demo-view', title: 'Demo View' },
  { id: 'publishing', title: 'Downloading and publishing' },
];

const NavigationBlock = ({ direction, item }) => {
  const formattedSubtitle = direction === 'previous' ? `« PREVIOUS` : `NEXT »`;

  return (
    <NavBlockWrapper
      style={{
        alignItems: direction === 'previous' ? 'flex-start' : 'flex-end',
      }}
    >
      <Subtitle>{formattedSubtitle}</Subtitle>
      <BaseLink to={`/docs/manual/${item.id}`}>{item.title}</BaseLink>
    </NavBlockWrapper>
  );
};

const PreviousNextBar = ({ currentPageId }) => {
  const currentIndex = pages.findIndex(page => page.id === currentPageId);

  const previous = pages[currentIndex - 1];
  const next = pages[currentIndex + 1];

  return (
    <>
      <Spacer size={40} />
      <HorizontalRule />
      <Wrapper>
        <Side>
          {previous && <NavigationBlock direction="previous" item={previous} />}
        </Side>
        <Side>{next && <NavigationBlock direction="next" item={next} />}</Side>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Side = styled.div``;

const NavBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: ${COLORS.blueGray[500]};
  margin-bottom: 6px;
`;

export default PreviousNextBar;
