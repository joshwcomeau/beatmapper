import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import Heading from '../Heading';

const TableOfContents = ({ title, toc }) => {
  console.log(toc);
  const headings = toc.filter(item => item.level <= 4);

  return (
    <Wrapper>
      <Title>{title}</Title>

      {headings.map(({ title, id }) => (
        <HeadingLink key={id} href={`#${id}`}>
          {title}
        </HeadingLink>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 180px;
  margin-left: 40px;
  line-height: 1.4;
  position: sticky;
  top: 100px;

  @media (max-width: 1199px) {
    display: none;
  }
`;

const Title = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 32px;
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
