import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

import Header from '../Header';
import Button from '../Button';
import Spacer from '../Spacer';
import AddSongForm from '../AddSongForm';
import Modal from '../Modal';
import ImportMap from '../ImportMap';

const FirstTimeHome = () => {
  const [newSongFormVisible, setNewSongFormVisible] = React.useState(false);

  return (
    <>
      <Header />
      <Spacer size={UNIT * 8} />

      <MainContent>
        <p>Introductory copy!</p>
        <Spacer size={UNIT * 4} />

        <Button onClick={() => setNewSongFormVisible(true)}>
          Add first song
        </Button>
        <Spacer size={UNIT * 2} />
        <ImportMap height={140} />

        <Modal
          isVisible={newSongFormVisible}
          clickBackdropToDismiss={false}
          onDismiss={() => setNewSongFormVisible(false)}
        >
          <AddSongForm />
        </Modal>
      </MainContent>
    </>
  );
};

const MainContent = styled.div`
  max-width: 800px;
  padding: ${UNIT * 2}px;
  margin: auto;
`;

export default FirstTimeHome;
