import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import get from 'lodash.get';

import * as actions from '../../actions';
import { getSelectedSong } from '../../reducers/songs.reducer';

import LabeledCheckbox from '../LabeledCheckbox';
import QuestionTooltip from '../QuestionTooltip';
import Link from '../Link';

const MappingExtensionSettings = ({
  song,
  toggleModForSong,
  updateModColor,
}) => {
  const isModEnabled =
    get(song, 'modSettings.mappingExtensions.isEnabled') || false;

  return (
    <Wrapper>
      <LabeledCheckbox
        id="enable-mapping-extensions"
        checked={isModEnabled}
        onChange={() => toggleModForSong('mappingExtensions')}
      >
        Enable Mapping Extensions{' '}
        <QuestionTooltip>
          Allows you to customize size and shape of the grid, to place notes
          outside of the typical 4×3 grid.{' '}
          <Link forceAnchor to="/docs/mods#mapping-extensions">
            Learn more
          </Link>
          .
        </QuestionTooltip>
      </LabeledCheckbox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  user-select: none;
`;

const mapStateToProps = state => ({
  song: getSelectedSong(state),
});

const mapDispatchToProps = {
  toggleModForSong: actions.toggleModForSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MappingExtensionSettings);
