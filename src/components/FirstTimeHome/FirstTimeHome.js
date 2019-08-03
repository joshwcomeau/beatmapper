import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import { upload } from 'react-icons-kit/feather/upload';
import { tv } from 'react-icons-kit/feather/tv';

import { COLORS, UNIT } from '../../constants';
import { getDemoSong } from '../../reducers/songs.reducer';

import Header from '../Header';
import Spacer from '../Spacer';
import AddSongForm from '../AddSongForm';
import Modal from '../Modal';
import Paragraph from '../Paragraph';
import Heading from '../Heading';
import Center from '../Center';

import OptionColumn from './OptionColumn';

const FirstTimeHome = ({ demoSong, history }) => {
  const [newSongFormVisible, setNewSongFormVisible] = React.useState(false);

  return (
    <>
      <Header />
      <Spacer size={UNIT * 8} />

      <MainContent>
        <Center>
          <Title size={1}>
            BeatMapper is an unofficial web-based editor for Beat Saber™
          </Title>
          <Spacer size={UNIT * 4} />
          <div
            style={{
              width: '100%',
              height: 0,
              paddingBottom: (9 / 16) * 100 + '%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />

          <Spacer size={UNIT * 10} />
          <Heading size={2}>Get started now</Heading>
        </Center>
        <Spacer size={UNIT * 6} />
        <Row>
          <OptionColumn
            icon={tv}
            title="Try a demo map"
            description="Take the editor for a test-drive with a sample song"
            buttonText="Start editing"
            status={demoSong ? 'ready' : 'loading'}
            handleClick={() => {
              if (!demoSong) {
                return;
              }

              history.push(
                `/edit/${demoSong.id}/${demoSong.selectedDifficulty}/notes`
              );
            }}
          />
          <Spacer size={UNIT * 6} />
          <OptionColumn
            icon={filePlus}
            title="Create new song"
            description="Build a new map from scratch, using music from your computer"
            buttonText="Create from scratch"
            handleClick={() => setNewSongFormVisible(true)}
          />
          <Spacer size={UNIT * 6} />
          <OptionColumn
            icon={upload}
            title="Import existing map"
            description="Edit an existing map by selecting it from your computer"
            buttonText="Import map"
            handleClick={() => setNewSongFormVisible(true)}
          />
        </Row>

        <Spacer size={UNIT * 10} />

        {/* <ImportMap height={140} /> */}

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
  max-width: 850px;
  padding: ${UNIT * 2}px;
  margin: auto;
`;

const Title = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${COLORS.blueGray[300]};
  font-size: 25px;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
`;

const mapStateToProps = state => ({
  demoSong: getDemoSong(state),
});

export default withRouter(connect(mapStateToProps)(FirstTimeHome));
