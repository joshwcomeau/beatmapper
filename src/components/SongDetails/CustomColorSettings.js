import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getSelectedSong } from '../../reducers/songs.reducer';

import CenteredSpinner from '../CenteredSpinner';
import Checkbox from '../Checkbox';
import Heading from '../Heading';
import Spacer from '../Spacer';

const ColorPicker = React.lazy(() => import('../ColorPicker'));

const CustomColorSettings = ({ song, toggleModForSong, updateModColor }) => {
  if (!song || !song.modSettings) {
    return null;
  }

  const colors = song.modSettings.customColors;

  const isModEnabled = !!(
    song.modSettings.customColors && song.modSettings.customColors.isEnabled
  );

  return (
    <Wrapper>
      <Row>
        <Checkbox
          id="enable-colors"
          checked={isModEnabled}
          onChange={() => toggleModForSong('customColors')}
        />
        <label htmlFor="enable-colors">Enable custom colors</label>
      </Row>

      {isModEnabled && (
        <React.Suspense fallback={<CenteredSpinner />}>
          <Spacer size={UNIT * 4} />
          <Row>
            <Cell>
              <ColorPicker
                colorId="colorLeft"
                color={colors.colorLeft}
                updateColor={updateModColor}
              />
              <Spacer size={UNIT * 2} />
              <Heading size={3}>Left Saber</Heading>
            </Cell>
            <Cell>
              <ColorPicker
                colorId="colorRight"
                color={colors.colorRight}
                updateColor={updateModColor}
              />
              <Spacer size={UNIT * 2} />
              <Heading size={3}>Right Saber</Heading>
            </Cell>
            <Cell>
              <ColorPicker
                colorId="envColorLeft"
                color={colors.envColorLeft}
                updateColor={updateModColor}
              />
              <Spacer size={UNIT * 2} />
              <Heading size={3}>Environment 1</Heading>
            </Cell>
            <Cell>
              <ColorPicker
                colorId="envColorRight"
                color={colors.envColorRight}
                updateColor={updateModColor}
              />
              <Spacer size={UNIT * 2} />
              <Heading size={3}>Environment 2</Heading>
            </Cell>
            <Cell>
              <ColorPicker
                colorId="obstacleColor"
                color={colors.obstacleColor}
                updateColor={updateModColor}
              />
              <Spacer size={UNIT * 2} />
              <Heading size={3}>Obstacles</Heading>
            </Cell>
          </Row>
          <Spacer size={UNIT * 4} />
        </React.Suspense>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Cell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const mapStateToProps = state => ({
  song: getSelectedSong(state),
});

const mapDispatchToProps = {
  toggleModForSong: actions.toggleModForSong,
  updateModColor: actions.updateModColor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomColorSettings);
