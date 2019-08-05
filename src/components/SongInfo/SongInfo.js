import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';
import { UNIT, COLORS } from '../../constants';
import { getLabelForDifficulty } from '../../helpers/song.helpers';
import {
  getSelectedSong,
  getSelectedSongDifficultyIds,
} from '../../reducers/songs.reducer';
import { getDifficulty } from '../../reducers/editor-entities.reducer';

import Spacer from '../Spacer';
import CoverArtImage from '../CoverArtImage';
import Modal from '../Modal';
import Dropdown from '../Dropdown';
import CreateDifficultyForm from '../CreateDifficultyForm';

const COVER_ART_SIZE = 75;

const NotesEditorSongInfo = ({
  song,
  selectedDifficulty,
  difficultyIds,
  history,
  pausePlaying,
}) => {
  const [
    showCreateDifficultyModal,
    setShowCreateDifficultyModal,
  ] = React.useState(false);

  return (
    <>
      <Wrapper style={{ height: COVER_ART_SIZE }}>
        <CoverArtImage size={COVER_ART_SIZE} filename={song.coverArtFilename} />
        <Description>
          <Text>
            <Title>{song.name}</Title>
            <Spacer size={UNIT / 2} />
            <Subtitle>{song.artistName}</Subtitle>
          </Text>
          <Spacer size={UNIT} />
          {selectedDifficulty && (
            <Dropdown
              label=""
              value={selectedDifficulty}
              onChange={ev => {
                ev.target.blur();

                const { value } = ev.target;

                if (value === 'create-new') {
                  setShowCreateDifficultyModal(true);
                } else {
                  // TODO: Having the difficulty as part of the URL means that
                  // a bunch of state is reset when you change URLs, stuff like
                  // your position in the song. This might be annoying when
                  // trying to jump quickly between two difficulties :/
                  //
                  // Maybe I can solve this by pushing query strings?
                  // ?offset=716.83
                  history.push(`/edit/${song.id}/${value}/notes`);
                }
              }}
              width={90}
              height={28}
            >
              {difficultyIds.map(id => (
                <option
                  key={id}
                  value={id}
                  when-selected={getLabelForDifficulty(id)}
                >
                  {getLabelForDifficulty(id)}
                </option>
              ))}
              <option value="create-new" when-selected="--">
                + Create new
              </option>
            </Dropdown>
          )}
        </Description>
      </Wrapper>
      <Modal
        width={430}
        isVisible={showCreateDifficultyModal}
        clickBackdropToDismiss={true}
        onDismiss={() => setShowCreateDifficultyModal(false)}
      >
        <CreateDifficultyForm
          afterSubmit={difficulty => {
            setShowCreateDifficultyModal(false);
            history.push(`/edit/${song.id}/${difficulty}/notes`);
          }}
        />
      </Modal>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  padding-left: ${UNIT}px;
`;

const Description = styled.div`
  width: 150px;
  padding-left: ${UNIT}px;
`;

const Title = styled.div`
  font-size: 21px;
  color: ${COLORS.gray[100]};
`;

const Subtitle = styled.div`
  font-size: 16px;
  color: ${COLORS.gray[300]};
`;

const mapStateToProps = state => {
  const song = getSelectedSong(state);
  const difficultyIds = getSelectedSongDifficultyIds(state);

  return { song, selectedDifficulty: getDifficulty(state), difficultyIds };
};

const mapDispatchToProps = {
  pausePlaying: actions.pausePlaying,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NotesEditorSongInfo)
);
