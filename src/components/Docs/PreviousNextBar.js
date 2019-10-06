import React from 'react';
import styled from 'styled-components';

const pages = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'notes-view', label: 'Notes View' },
  { id: 'events-view', label: 'Events View' },
  { id: 'downloading-and-publishing', label: 'Downloading and publishing' },
];

const PreviousNextBar = ({ currentPageId }) => {
  const currentIndex = pages.findIndex(page => page.id === currentPageId);

  const previous = pages[currentIndex - 1];
  const next = pages[currentIndex + 1];

  return (
    <Wrapper>
      <Left>
        {previous && <a href={`/docs/${previous.id}`}>« {previous.label}</a>}
      </Left>
      <Right>{next && <a href={`/docs/${next.id}`}>{next.label} »</a>}</Right>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Left = styled.div``;

const Right = styled.div``;

export default PreviousNextBar;
