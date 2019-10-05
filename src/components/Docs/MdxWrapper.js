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

const Image = props => (
  <ImageWrapper>
    <img {...props} />
    {props.caption && <ImageCaption>{props.caption}</ImageCaption>}
  </ImageWrapper>
);

const components = {
  img: Image,
};

const MdxWrapper = ({ children }) => {
  return (
    <DocumentStyles>
      <MDXProvider components={components}>{children}</MDXProvider>
    </DocumentStyles>
  );
};

const ImageWrapper = styled.div`
  max-width: 100%;
  padding: 8px;
  border-radius: 6px;
  /* border: 1px solid ${COLORS.blueGray[100]}; */
  margin-left: -8px;
  margin-right: -8px;
  margin-bottom: 24px;

  &:hover {
    background: ${COLORS.blueGray[50]};
  }

  img {
    display: block;
    width: 100%;
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

  ul {
    margin-bottom: 40px;
  }

  li {
    margin-left: 20px;
    list-style-type: disc;
    margin-bottom: 18px;
  }
`;

export default MdxWrapper;
