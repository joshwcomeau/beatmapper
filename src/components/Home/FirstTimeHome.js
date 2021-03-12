import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { filePlus } from 'react-icons-kit/feather/filePlus';
import { download } from 'react-icons-kit/feather/download';
import { box } from 'react-icons-kit/feather/box';

import * as actions from '../../actions';
import { COLORS, UNIT } from '../../constants';
import useWindowDimensions from '../../hooks/use-window-dimensions.hook';
import { getDemoSong } from '../../reducers/songs.reducer';
import heroVideo from '../../assets/videos/hero-video.mp4';

import Spacer from '../Spacer';
import Heading from '../Heading';
import Center from '../Center';

import OptionColumn from './OptionColumn';

const WRAPPER_MAX_WIDTH = 850;
const WRAPPER_PADDING = UNIT * 2;

const FirstTimeHome = ({ loadDemoMap, setModal, demoSong }) => {
  const { width: windowWidth } = useWindowDimensions();

  const [isLoadingDemo, setIsLoadingDemo] = React.useState(false);

  const videoWidth = Math.min(WRAPPER_MAX_WIDTH, windowWidth);

  return (
    <MainContent>
      <Center>
        <Title size={1}>
          Beatmapper is an unofficial web-based editor for Beat Saber™
        </Title>
        <Spacer size={UNIT * 4} />
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          controls
          style={{
            width: videoWidth,
            marginLeft: -WRAPPER_PADDING,
            marginRight: -WRAPPER_PADDING,
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
          buttonText={isLoadingDemo ? 'Loading…' : 'Start editing'}
          handleClick={() => {
            if (!demoSong) {
              setIsLoadingDemo(true);
              loadDemoMap();
            }
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
  max-width: ${WRAPPER_MAX_WIDTH}px;
  padding: ${WRAPPER_PADDING}px;
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

  @media (max-width: 740px) {
    flex-direction: column;
  }
`;

const Divider = styled.div`
  margin-left: ${UNIT * 4}px;
  margin-right: ${UNIT * 4}px;
  width: 0px;
  border-left: 1px dotted ${COLORS.blueGray[500]};
`;

const mapStateToProps = (state) => ({
  demoSong: getDemoSong(state),
});

const mapDispatchToProps = {
  loadDemoMap: actions.loadDemoMap,
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeHome);
