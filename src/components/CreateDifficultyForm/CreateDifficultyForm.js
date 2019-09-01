import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { sliders } from 'react-icons-kit/feather/sliders';
import { Tooltip } from 'react-tippy';

import * as actions from '../../actions';
import { UNIT, DIFFICULTIES } from '../../constants';
import { getLabelForDifficulty } from '../../helpers/song.helpers';
import {
  getSelectedSongId,
  getSelectedSongDifficultyIds,
} from '../../reducers/songs.reducer';
import { getDifficulty } from '../../reducers/editor-entities.reducer';

import Heading from '../Heading';
import Paragraph from '../Paragraph';
import Link from '../Link';
import DifficultyTag from '../DifficultyTag';
import Spacer from '../Spacer';
import Button from '../Button';

const CreateDifficultyForm = ({
  afterCreate,
  songId,
  currentDifficulty,
  difficultyIds,
  createDifficulty,
}) => {
  const [selectedId, setSelectedId] = React.useState(null);

  // If we already have all difficulties, let the user know
  if (difficultyIds.length === 5) {
    return (
      <Wrapper>
        <Heading size={1}>All beatmaps created</Heading>
        <Spacer size={UNIT * 4} />
        <Paragraph>
          You already have a beatmap for every available difficulty. You cannot
          create any more beatmaps for this song.
        </Paragraph>
        <Paragraph>Did you mean to select an existing difficulty?</Paragraph>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <Heading size={1}>Create new beatmap</Heading>
      <Spacer size={UNIT * 2} />
      <Paragraph>
        Select the difficulty you'd like to start creating. You can also copy an
        existing difficulty instead, on the{' '}
        <Link to={`/edit/${songId}/${currentDifficulty}/details`}>
          Song Details
        </Link>{' '}
        page (
        <IconWrapper>
          <Icon icon={sliders} size={15} />
        </IconWrapper>
        ).
      </Paragraph>
      <Spacer size={UNIT * 4} />
      <DifficultiesWrapper>
        {DIFFICULTIES.map(difficulty => {
          const alreadyExists = difficultyIds.includes(difficulty);

          return (
            <React.Fragment key={difficulty}>
              {alreadyExists ? (
                <Tooltip
                  title={
                    difficulty === currentDifficulty
                      ? `You're currently editing the ${currentDifficulty} beatmap`
                      : 'You already have a beatmap for this difficulty'
                  }
                >
                  <DifficultyTag
                    disabled
                    width={120}
                    difficulty={difficulty}
                    isSelected={selectedId === difficulty}
                    onSelect={setSelectedId}
                  />
                </Tooltip>
              ) : (
                <DifficultyTag
                  width={120}
                  difficulty={difficulty}
                  isSelected={selectedId === difficulty}
                  onSelect={setSelectedId}
                />
              )}
              <br />
            </React.Fragment>
          );
        })}
      </DifficultiesWrapper>
      <Spacer size={UNIT * 4} />
      <Button
        style={{ width: 275, margin: 'auto' }}
        onClick={() => {
          createDifficulty(selectedId, afterCreate);
        }}
      >
        Create {getLabelForDifficulty(selectedId)} beatmap
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
`;

const IconWrapper = styled.span`
  display: inline-block;
  padding: 5px;
  color: rgba(255, 255, 255, 0.5);
`;

const DifficultiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const mapStateToProps = state => {
  return {
    songId: getSelectedSongId(state),
    currentDifficulty: getDifficulty(state),
    difficultyIds: getSelectedSongDifficultyIds(state),
  };
};

const mapDispatchToProps = {
  createDifficulty: actions.createDifficulty,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDifficultyForm);
