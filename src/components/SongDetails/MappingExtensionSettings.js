import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSelectedSong } from '../../reducers/songs.reducer';

import Checkbox from '../Checkbox';
import QuestionTooltip from '../QuestionTooltip';
import Link from '../Link';

const MappingExtensionSettings = ({
  song,
  toggleModForSong,
  updateModColor,
}) => {
  if (!song || !song.modSettings) {
    return null;
  }

  const isModEnabled = !!song.modSettings.mappingExtensions;

  return (
    <Wrapper>
      <Row>
        <Checkbox
          id="enable-mapping-extensions"
          checked={isModEnabled}
          onChange={() => toggleModForSong('mappingExtensions')}
        />
        <label htmlFor="enable-mapping-extensions">
          Enable Mapping Extensions{' '}
          <QuestionTooltip>
            Allows you to customize size and shape of the grid, to place notes
            outside of the typical 4x3 grid.{' '}
            <Link forceAnchor to="/docs/mods#mapping-extensions">
              Learn more
            </Link>
            .
          </QuestionTooltip>
        </label>
      </Row>
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
