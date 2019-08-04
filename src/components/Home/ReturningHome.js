import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

import Button from '../Button';
import Spacer from '../Spacer';
import MaxWidthWrapper from '../MaxWidthWrapper';

import SongsTable from './SongsTable';
import Heading from '../Heading';

const ReturningHome = ({ songs, isProcessingImport, setModal }) => {
  return (
    <MaxWidthWrapper>
      <Spacer size={UNIT * 8} />
      <Heading size={1}>Select map to edit</Heading>
      <Spacer size={UNIT * 2} />
      <Row>
        <MainColumn flex={6}>
          <SongsTable songs={songs} isLoading={isProcessingImport} />
        </MainColumn>
        <Spacer size={UNIT * 2} />

        <SideColumn flex={2}>
          <Button
            style={{ width: '100%' }}
            onClick={() => setModal('create-new-song')}
          >
            Create new song
          </Button>
          <Spacer size={UNIT * 2} />
          <Button
            style={{ width: '100%' }}
            onClick={() => setModal('import-map')}
          >
            Import existing map
          </Button>
        </SideColumn>
      </Row>
    </MaxWidthWrapper>
  );
};

const Row = styled.div`
  display: flex;
`;

const Column = styled.div`
  flex: ${props => props.flex};
  padding: ${UNIT * 2}px;
`;

const MainColumn = styled(Column)`
  padding-left: 0;
`;

const SideColumn = styled(Column)`
  background: rgba(255, 255, 255, 0.06);
  padding: ${UNIT * 4}px;
  margin-top: ${UNIT * 2}px;
  margin-bottom: ${UNIT * 2}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${UNIT}px;
  min-width: 280px;
`;
export default ReturningHome;
