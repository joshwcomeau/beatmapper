import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getSelectedSong } from '../../reducers/songs.reducer';

import CenteredSpinner from '../CenteredSpinner';
import LabeledCheckbox from '../LabeledCheckbox';
import Heading from '../Heading';
import Spacer from '../Spacer';
import MiniSlider from '../MiniSlider';
import QuestionTooltip from '../QuestionTooltip';
import Link from '../Link';

const ColorPicker = React.lazy(() => import('../ColorPicker'));

const TRACK_IDS = [
  'colorLeft',
  'colorRight',
  'envColorLeft',
  'envColorRight',
  'obstacleColor',
];

const TRACK_LABELS = {
  colorLeft: 'Left Saber',
  colorRight: 'Right Saber',
  envColorLeft: 'Environment 1',
  envColorRight: 'Environment 2',
  obstacleColor: 'Obstacles',
};

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
      <LabeledCheckbox
        id="enable-colors"
        checked={isModEnabled}
        onChange={() => toggleModForSong('customColors')}
      >
        Enable custom colors{' '}
        <QuestionTooltip>
          Override the default red/blue color scheme. Use "overdrive" to produce
          some neat effects.{' '}
          <Link forceAnchor to="/docs/mods#custom-colors">
            Learn more
          </Link>
          .
        </QuestionTooltip>
      </LabeledCheckbox>

      {isModEnabled && (
        <React.Suspense fallback={<CenteredSpinner />}>
          <Spacer size={UNIT * 4} />
          <Row>
            {TRACK_IDS.map(trackId => (
              <Cell key={trackId}>
                <ColorPicker
                  colorId={trackId}
                  color={colors[trackId]}
                  updateColor={updateModColor}
                />
                <Spacer size={UNIT * 2} />
                <Heading size={3}>{TRACK_LABELS[trackId]}</Heading>
                <Spacer size={UNIT * 3} />
                <Heading size={4}>Overdrive</Heading>
                <Spacer size={UNIT * 1} />
                <MiniSlider width={50} height={16} min={1} max={10} value={2} />
              </Cell>
            ))}
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
