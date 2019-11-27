import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getCustomColors } from '../../reducers/songs.reducer';

import CenteredSpinner from '../CenteredSpinner';
import LabeledCheckbox from '../LabeledCheckbox';
import Heading from '../Heading';
import Spacer from '../Spacer';
import MiniSlider from '../MiniSlider';
import QuestionTooltip from '../QuestionTooltip';
import Link from '../Link';

const ColorPicker = React.lazy(() => import('../ColorPicker'));

const ELEMENT_IDS = [
  'colorLeft',
  'colorRight',
  'envColorLeft',
  'envColorRight',
  'obstacleColor',
];

const ELEMENT_LABELS = {
  colorLeft: 'Left Saber',
  colorRight: 'Right Saber',
  envColorLeft: 'Environment 1',
  envColorRight: 'Environment 2',
  obstacleColor: 'Obstacles',
};

const CustomColorSettings = ({
  customColors,
  toggleModForSong,
  updateModColor,
  updateModColorIntensity,
}) => {
  return (
    <Wrapper>
      <LabeledCheckbox
        id="enable-colors"
        checked={customColors.isEnabled}
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

      {customColors.isEnabled && (
        <React.Suspense fallback={<CenteredSpinner />}>
          <Spacer size={UNIT * 4} />
          <Row>
            {ELEMENT_IDS.map(elementId => (
              <Cell key={elementId}>
                <ColorPicker
                  colorId={elementId}
                  color={customColors[elementId]}
                  updateColor={updateModColor}
                />
                <Spacer size={UNIT * 2} />
                <Heading size={3}>{ELEMENT_LABELS[elementId]}</Heading>
                <Spacer size={UNIT * 3} />
                <Heading size={4}>Overdrive</Heading>
                <Spacer size={UNIT * 1} />
                <MiniSlider
                  width={50}
                  height={16}
                  min={1}
                  max={10}
                  step={0.1}
                  value={customColors[elementId + 'Intensity']}
                  onChange={ev => {
                    console.log('change!', ev.target.value);
                    updateModColorIntensity(elementId, ev.target.value);
                  }}
                />
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
  customColors: getCustomColors(state),
});

const mapDispatchToProps = {
  toggleModForSong: actions.toggleModForSong,
  updateModColor: actions.updateModColor,
  updateModColorIntensity: actions.updateModColorIntensity,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomColorSettings);
