import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

export const Shortcut = ({ keys, children }) => {
  return (
    <ShortcutWrapper>
      <Keys>{keys}</Keys>
      <Children>{children}</Children>
    </ShortcutWrapper>
  );
};

export const ShortcutTable = ({ children }) => {
  return <TableWrapper>{children}</TableWrapper>;
};

const TableWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 3px;
  grid-row-gap: 3px;
  padding: 3px;
  border: 1px solid ${COLORS.blueGray[200]};
  border-radius: 4px;

  @media (min-width: 1400px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ShortcutWrapper = styled.div`
  display: flex;
  padding: 10px;
  border: 1px solid ${COLORS.blueGray[100]};
  border-radius: 2px;
`;

const Keys = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 150px;
`;

const Children = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
`;
