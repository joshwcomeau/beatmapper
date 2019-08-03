import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import {
  getIsNewUser,
  getAllSongsChronologically,
  getProcessingImport,
} from '../../reducers/songs.reducer';

import Header from '../Header';
import Button from '../Button';
import Spacer from '../Spacer';
import AddSongForm from '../AddSongForm';
import Modal from '../Modal';
import FirstTimeHome from '../FirstTimeHome';
import ImportMap from '../ImportMap';
import MaxWidthWrapper from '../MaxWidthWrapper';

import SongsTable from './SongsTable';
import Heading from '../Heading';

const Home = ({ isNewUser, songs, processingImport }) => {
  const [newSongFormVisible, setNewSongFormVisible] = React.useState(false);

  if (isNewUser) {
    return <FirstTimeHome />;
  }

  return (
    <>
      <Header />
      <MaxWidthWrapper>
        <Spacer size={UNIT * 8} />
        <Heading size={1}>Select map to edit</Heading>
        <Spacer size={UNIT * 2} />
        <Row>
          <MainColumn flex={4}>
            <SongsTable songs={songs} isLoading={processingImport} />
          </MainColumn>
          <Spacer size={UNIT * 2} />

          <SideColumn flex={2}>
            <Button onClick={() => setNewSongFormVisible(true)}>
              Create new song
            </Button>
            <Spacer size={UNIT * 4} />
            <ImportMap height={140} />
          </SideColumn>
        </Row>
      </MaxWidthWrapper>

      <Modal
        isVisible={newSongFormVisible}
        clickBackdropToDismiss={false}
        onDismiss={() => setNewSongFormVisible(false)}
      >
        <AddSongForm />
      </Modal>
    </>
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
`;

const mapStateToProps = state => {
  return {
    isNewUser: getIsNewUser(state),
    songs: getAllSongsChronologically(state),
    processingImport: getProcessingImport(state),
  };
};

const mapDispatchToProps = {
  importExistingSong: actions.importExistingSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
