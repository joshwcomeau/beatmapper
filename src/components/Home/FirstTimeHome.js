import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import { download } from 'react-icons-kit/feather/download';
import { box } from 'react-icons-kit/feather/box';

import { COLORS, UNIT } from '../../constants';
import { getDemoSong } from '../../reducers/songs.reducer';

import Spacer from '../Spacer';
import Heading from '../Heading';
import Center from '../Center';

import OptionColumn from './OptionColumn';

const FirstTimeHome = ({ setModal, demoSong, history }) => {
  return (
    <MainContent>
      <Center>
        <Title size={1}>
          Beatmapper is an unofficial web-based editor for Beat Saber™
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
          icon={box}
          title="Try a demo map"
          description="Take the editor for a test-drive with some surprisingly good public-domain dubstep"
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
        <Divider />
        <OptionColumn
          icon={filePlus}
          title="Create new song"
          description="Build a new map from scratch, using music from your computer"
          buttonText="Create from scratch"
          handleClick={() => setModal('create-new-song')}
        />
        <Divider />
        <OptionColumn
          icon={download}
          title="Import existing map"
          description="Edit an existing map by selecting it from your computer"
          buttonText="Import map"
          handleClick={() => setModal('import-map')}
        />
      </Row>

      <Spacer size={UNIT * 10} />
    </MainContent>
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

const Divider = styled.div`
  margin-left: ${UNIT * 4}px;
  margin-right: ${UNIT * 4}px;
  width: 0px;
  border-left: 1px dotted ${COLORS.blueGray[500]};
`;

const mapStateToProps = state => ({
  demoSong: getDemoSong(state),
});

export default withRouter(connect(mapStateToProps)(FirstTimeHome));
