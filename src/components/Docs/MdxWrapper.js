/**
 * MDX translates .md documents into React components.
 * By default, it uses sensible defaults:
 *
 * ### Hello -> <h3>Hello</h3>
 *
 * In simple cases, I just need to style these HTML tags.
 * For other cases, I might want to supply a custom component.
 * For example, I want to wrap images in a custom <Image>
 * component, so that I can style it accordingly.
 *
 * This component handles both of those concerns.
 */
import React from 'react';
import styled from 'styled-components';
import { MDXProvider } from '@mdx-js/react';

import { COLORS } from '../../constants';

import BaseLink from '../BaseLink';
import YoutubeEmbed from '../YoutubeEmbed';
import HorizontalRule from './HorizontalRule';

const Image = ({ width, caption, ...props }) => (
  <OuterImageWrapper>
    <ImageWrapper>
      <img {...props} alt={caption} style={{ width }} />
      {caption && <ImageCaption>{caption}</ImageCaption>}
    </ImageWrapper>
  </OuterImageWrapper>
);

const Subtle = styled.span`
  opacity: 0.5;
  font-style: italic;
`;

const Pre = styled.pre`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.04);
  font-family: monospace;
  margin: 2rem 0;

  code {
    background: transparent !important;
  }
`;

const components = {
  a: ({ href, ...props }) => <BaseLink {...props} to={href} />,
  img: Image,
  subtle: Subtle,
  hr: HorizontalRule,
  pre: Pre,
  YoutubeEmbed,
};

const MdxWrapper = ({ children }) => {
  return (
    <DocumentStyles>
      <MDXProvider components={components}>{children}</MDXProvider>
    </DocumentStyles>
  );
};

const OuterImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-left: -8px;
  margin-right: -8px;
`;

const ImageWrapper = styled.div`
display: inline-block;
  max-width: 100%;
  padding: 8px;
  border-radius: 6px;
  /* border: 1px solid ${COLORS.blueGray[100]}; */
  margin-bottom: 24px;

  &:hover {
    background: ${COLORS.blueGray[50]};
  }

  img {
    display: block;
    max-width: 100%;
    border-radius: 4px;
  }
`;

const ImageCaption = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 8px;
`;

const DocumentStyles = styled.div`
  line-height: 1.4;
  font-size: 18px;
  color: ${COLORS.blueGray[900]};

  p {
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
    margin-top: 42px;
    margin-bottom: 16px;
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
    font-size: 21px;
    font-weight: 700;
    color: ${COLORS.blueGray[500]};
  }

  h4 {
    font-size: 18px;
    font-weight: 700;
  }

  ul,
  ol {
    margin-bottom: 40px;
  }

  li {
    margin-left: 20px;
    list-style-type: disc;
    margin-bottom: 18px;
  }

  code {
    display: inline-block;
    font-family: monospace;
    padding: 2px 5px;
    font-size: 0.9em;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  table {
    min-width: 300px;
    margin-bottom: 25px;
  }

  th,
  td {
    padding: 5px 10px;
  }

  th {
    text-align: left;
    font-weight: bold;
    border-bottom: 1px solid ${COLORS.blueGray[300]};
  }

  td {
    font-size: 15px;

    border-bottom: 1px solid ${COLORS.blueGray[100]};
  }

  tr:last-of-type td {
    border-bottom: none;
  }

  blockquote {
    padding: 20px;
    background: hsla(212, 100%, 45%, 0.2);
    border-left: 3px solid ${COLORS.blue[500]};
    border-radius: 3px;
    font-size: 0.9em;
    margin-bottom: 30px;

    *:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export default MdxWrapper;
