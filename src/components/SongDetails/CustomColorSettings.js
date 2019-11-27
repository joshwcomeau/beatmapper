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

const ELEMENT_DATA = {
  colorLeft: {
    label: 'Left Saber',
    maxValue: 5,
  },
  colorRight: {
    label: 'Right Saber',
    maxValue: 5,
  },
  envColorLeft: {
    label: 'Environment 1',
    maxValue: 3,
  },
  envColorRight: {
    label: 'Environment 2',
    maxValue: 3,
  },
  obstacleColor: {
    label: 'Obstacles',
    maxValue: 10,
  },
};

const CustomColorSettings = ({
  customColors,
  toggleModForSong,
  updateModColor,
  updateModColorOverdrive,
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
            {ELEMENT_IDS.map(elementId => {
              const color = customColors[elementId];
              const overdrive = customColors[elementId + 'Overdrive'];

              return (
                <Cell key={elementId}>
                  <ColorPicker
                    colorId={elementId}
                    color={color}
                    updateColor={updateModColor}
                    overdrive={overdrive}
                  />
                  <Spacer size={UNIT * 2} />
                  <Heading size={3}>{ELEMENT_DATA[elementId].label}</Heading>
                  <Spacer size={UNIT * 3} />
                  <Heading size={4}>Overdrive</Heading>
                  <Spacer size={UNIT * 1} />
                  <MiniSlider
                    width={50}
                    height={16}
                    min={0}
                    max={1}
                    step={0.01}
                    value={overdrive}
                    onChange={ev => {
                      updateModColorOverdrive(
                        elementId,
                        Number(ev.target.value)
                      );
                    }}
                  />
                </Cell>
              );
            })}
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
  updateModColorOverdrive: actions.updateModColorOverdrive,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomColorSettings);
