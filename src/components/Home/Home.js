import React from 'react';
import { connect } from 'react-redux';

import {
  getAllSongsChronologically,
  getProcessingImport,
} from '../../reducers/songs.reducer';
import { getIsNewUser } from '../../reducers/user.reducer';

import BasicLayout from '../BasicLayout';
import AddSongForm from '../AddSongForm';
import Modal from '../Modal';

import FirstTimeHome from './FirstTimeHome';
import ReturningHome from './ReturningHome';
import ImportMapForm from '../ImportMapForm';

const Home = ({ isNewUser, songs, isProcessingImport }) => {
  const [modal, setModal] = React.useState(false);

  return (
    <BasicLayout>
      {isNewUser ? (
        <FirstTimeHome setModal={setModal} />
      ) : (
        <ReturningHome
          songs={songs}
          isProcessingImport={isProcessingImport}
          setModal={setModal}
        />
      )}

      <Modal
        isVisible={modal === 'create-new-song'}
        clickBackdropToDismiss={false}
        onDismiss={() => setModal(null)}
      >
        <AddSongForm />
      </Modal>
      <Modal
        isVisible={modal === 'import-map'}
        onDismiss={() => setModal(null)}
      >
        <ImportMapForm
          onImport={() => setModal(null)}
          onCancel={() => setModal(null)}
        />
      </Modal>
    </BasicLayout>
  );
};

const mapStateToProps = state => {
  return {
    isNewUser: getIsNewUser(state),
    songs: getAllSongsChronologically(state),
    isProcessingImport: getProcessingImport(state),
  };
};

export default connect(mapStateToProps)(Home);
