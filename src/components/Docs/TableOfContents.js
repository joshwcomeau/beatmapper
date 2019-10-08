import React from 'react';
import styled from 'styled-components';
import Icon from 'react-icons-kit';
import { externalLink } from 'react-icons-kit/feather/externalLink';

import { COLORS } from '../../constants';
import { throttle } from '../../utils';

import Spacer from '../Spacer';
import BaseLink from '../BaseLink';

const useActiveHeading = headings => {
  const [activeHeading, setActiveHeading] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = throttle(() => {
      // The first heading within the viewport is the one we want to highlight.
      const firstHeadingInViewport = [...headings].find(({ id }) => {
        const elem = document.querySelector(`#${id}`);
        const bb = elem.getBoundingClientRect();

        return bb.bottom > 0;
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

  return [activeHeading, setActiveHeading];
};

const TableOfContents = ({ toc, location }) => {
  const headings = toc.filter(item => item.level <= 4);

  const [activeHeading, manuallySetActiveHeading] = useActiveHeading(headings);

  const handleClickIntro = () => {
    window.scrollTo({ top: 0 });
    // HACK: So when the user explicitly clicks the "intro" link, I want
    // to make that the selected one. Unfortunately, window.scrollTo
    // triggers the `handleScroll` in `useActiveHeading`, and so in
    // order for the manual override to work, I need to wait a frame.
    //
    // This whole solution feels janky, there's probably a better way
    // to model this.
    window.requestAnimationFrame(() => manuallySetActiveHeading(null));
  };

  const ghLink = `https://github.com/joshwcomeau/beatmapper/master${location.pathname}`;

  return (
    <Wrapper>
      <Title>Table of Contents</Title>

      <HeadingLink
        href="#"
        onClick={handleClickIntro}
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

      <Spacer size={30} />
      <GithubLink to={ghLink}>
        Suggest an edit
        <Spacer size={12} />
        <Icon icon={externalLink} />
      </GithubLink>
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

const GithubLink = styled(BaseLink)`
  display: flex;
  align-items: center;
  color: ${COLORS.blueGray[300]};
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
`;

export default TableOfContents;
