import React from 'react';
import styled from 'styled-components';

import SongsTableRow from './SongsTableRow';
import { COLORS, UNIT } from '../../constants';
import CenteredSpinner from '../CenteredSpinner';

const SongsTable = ({ songs, isLoading }) => {
  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th />
            <th>Title</th>
            <th>Difficulties</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <SongsTableRow key={song.id} song={song} />
          ))}
        </tbody>
      </Table>

      {isLoading && (
        <LoadingBlocker>
          <CenteredSpinner />
        </LoadingBlocker>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const LoadingBlocker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background: hsla(222, 30%, 7%, 0.75);
`;

const Table = styled.table`
  position: relative;
  z-index: 1;
  width: 100%;

  & th {
    text-align: left;
    font-size: 13px;
    font-weight: 300;
    color: ${COLORS.gray[300]};
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding: ${UNIT}px;
  }

  & th:nth-of-type(3),
  & th:nth-of-type(4) {
    text-align: center;
  }

  tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
  tr:last-of-type {
    border-bottom: none;
  }
`;

export default SongsTable;
