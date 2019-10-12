import React from 'react';
import styled from 'styled-components';
import Icon from 'react-icons-kit';
import { externalLink } from 'react-icons-kit/feather/externalLink';

import { COLORS } from '../../constants';
import { throttle } from '../../utils';

import Spacer from '../Spacer';
import BaseLink from '../BaseLink';

const useActiveHeading = headings => {
  const [activeHeadingId, setActiveHeading] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = throttle(() => {
      // If we're all the way at the top, there is no active heading.
      // This is done because "Introduction", the first link in the TOC, will
      // be active if `heading` is `null`.
      if (window.pageYOffset === 0) {
        return setActiveHeading(null);
      }

      // There HAS to be a better single-step algorithm for this, but I can't
      // think of it. So I'm doing this in 2 steps:
      //
      // 1. Are there any headings in the viewport right now? If so, pick the
      //    top one.
      // 2. If there are no headings in the viewport, are there any above
      //    the viewport? If so, pick the last one (most recently scrolled out
      //    of view)
      //
      // If neither condition is met, I'll assume I'm still in the intro,
      // although this would have to be a VERY long intro to ever be true.

      let headingBoxes = headings.map(({ id }) => {
        const elem = document.querySelector(`#${id}`);
        return { id, box: elem.getBoundingClientRect() };
      });

      // The first heading within the viewport is the one we want to highlight.
      let firstHeadingInViewport = headingBoxes.find(({ box }) => {
        return box.bottom > 0 && box.top < window.innerHeight;
      });

      // If there is no heading in the viewport, check and see if there are any
      // above the viewport.
      if (!firstHeadingInViewport) {
        const reversedBoxes = [...headingBoxes].reverse();

        firstHeadingInViewport = reversedBoxes.find(({ box }) => {
          return box.bottom < 0;
        });
      }

      if (!firstHeadingInViewport) {
        setActiveHeading(null);
      } else if (firstHeadingInViewport.id !== activeHeadingId) {
        setActiveHeading(firstHeadingInViewport.id);
      }
    }, 500);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeHeadingId, headings]);

  return activeHeadingId;
};

const getGithubLink = pathname => {
  const prefix = 'https://github.com/joshwcomeau/beatmapper/edit/master/src';

  if (pathname === '/docs') {
    return prefix + pathname + '/intro.mdx';
  }

  return prefix + pathname + '.mdx';
};

const TableOfContents = ({ toc, location }) => {
  const headings = toc.filter(item => item.level <= 4);

  const activeHeadingId = useActiveHeading(headings);

  const handleClickIntro = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <Wrapper>
      <Title>Table of Contents</Title>

      <HeadingLink
        href="#"
        onClick={handleClickIntro}
        style={{
          color: activeHeadingId ? undefined : COLORS.pink[700],
        }}
      >
        Introduction
      </HeadingLink>

      {headings.map(({ title, id }) => (
        <HeadingLink
          key={id}
          href={`#${id}`}
          style={{
            color: id === activeHeadingId ? COLORS.pink[700] : undefined,
          }}
        >
          {title}
        </HeadingLink>
      ))}

      <Spacer size={30} />
      <GithubLink to={getGithubLink(location.pathname)}>
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
