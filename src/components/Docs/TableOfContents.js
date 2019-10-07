import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { throttle } from '../../utils';

const useActiveHeading = headings => {
  const [activeHeading, setActiveHeading] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = throttle(() => {
      // The first heading within the viewport is the one we want to highlight.
      const firstHeadingInViewport = [...headings].reverse().find(({ id }) => {
        const elem = document.querySelector(`#${id}`);
        const bb = elem.getBoundingClientRect();

        return bb.bottom < window.innerHeight;
      });

      if (!firstHeadingInViewport) {
        setActiveHeading(null);
      } else if (firstHeadingInViewport !== activeHeading) {
        setActiveHeading(firstHeadingInViewport);
      }
    }, 500);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  return activeHeading;
};

const TableOfContents = ({ toc }) => {
  const headings = toc.filter(item => item.level <= 4);

  const activeHeading = useActiveHeading(headings);

  return (
    <Wrapper>
      <Title>Table of Contents</Title>

      <HeadingLink
        href="#"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          color: activeHeading ? undefined : COLORS.pink[700],
        }}
      >
        Introduction
      </HeadingLink>

      {headings.map(({ title, id }) => (
        <HeadingLink
          key={id}
          href={`#${id}`}
          style={{
            color:
              activeHeading && id === activeHeading.id
                ? COLORS.pink[700]
                : undefined,
          }}
        >
          {title}
        </HeadingLink>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 180px;
  line-height: 1.4;
  position: sticky;
  top: 100px;
  margin-left: 40px;

  @media (max-width: 1199px) {
    display: none;
  }
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${COLORS.blueGray[100]};
`;

const HeadingLink = styled.a`
  display: block;
  color: ${COLORS.blueGray[700]};
  text-decoration: none;
  margin-bottom: 14px;

  &:hover {
    color: ${COLORS.blueGray[500]};
    text-decoration: underline;
  }
`;

export default TableOfContents;
