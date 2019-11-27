import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { COLORS, UNIT, DIFFICULTIES } from '../../constants';
import * as actions from '../../actions';
import { getSongIdFromName } from '../../helpers/song.helpers';
import { getAllSongIds } from '../../reducers/songs.reducer';
import {
  saveSongFile,
  saveLocalCoverArtFile,
} from '../../services/file.service';

import TextInput from '../TextInput';
import Heading from '../Heading';
import Spacer from '../Spacer';
import Spinner from '../Spinner';
import DifficultyTag from '../DifficultyTag';
import Button from '../Button';
import QuestionTooltip from '../QuestionTooltip';

import CoverArtPicker from './CoverArtPicker';
import SongPicker from './SongPicker';

const MEDIA_ROW_HEIGHT = 150;

const AddSongForm = ({ createNewSong, currentSongIds, history }) => {
  // These files are sent to the redux middleware.
  // We'll store them on disk (currently in indexeddb, but that may change),
  // and capture a reference to them by a filename, which we'll store in redux.
  const [coverArtFile, setCoverArtFile] = React.useState(null);
  const [songFile, setSongFile] = React.useState(null);

  const [name, setSongName] = React.useState('');
  const [subName, setSongSubName] = React.useState('');
  const [artistName, setArtistName] = React.useState('');
  const [bpm, setBpm] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('');

  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const handleSubmit = async ev => {
    if (!name || !artistName || !bpm) {
      return;
    }

    ev.preventDefault();

    if (!songFile) {
      return alert('Please select a song file first');
    }

    if (!selectedDifficulty) {
      return alert(
        'Please select a difficulty. You can always create other difficulties later.'
      );
    }

    setHasSubmitted(true);

    const songId = getSongIdFromName(name);

    // Song IDs must be unique, and song IDs are generated from the name.
    // TODO: I could probably just append a `-2` or something, if this
    // constraint turns out to be annoying in some cases
    const isUnique = !currentSongIds.some(id => id === songId);
    if (!isUnique) {
      alert(
        'You already have a song with this name. Please choose a unique name.'
      );
      setHasSubmitted(false);
      return;
    }

    try {
      const [coverArtFilename] = await saveLocalCoverArtFile(
        songId,
        coverArtFile
      );
      const [songFilename] = await saveSongFile(songId, songFile);

      createNewSong(
        coverArtFilename,
        coverArtFile,
        songFilename,
        songFile,
        songId,
        name,
        subName,
        artistName,
        bpm,
        offset,
        selectedDifficulty
      );

      // Wait for the `createNewSong` action to flush, and then redirect the
      // user to the new song page!
      window.requestAnimationFrame(() => {
        history.push(`/edit/${songId}/${selectedDifficulty}/notes`);
      });
    } catch (err) {
      console.error('Could not save files to local storage', err);
      // TODO: Proper error toasts
      alert('Error creating map. See console for more information.');

      setHasSubmitted(false);
    }
  };

  return (
    <Wrapper>
      <Heading size={1}>Add new song</Heading>
      <Spacer size={UNIT * 6} />

      <Row>
        <div style={{ flex: 1 }}>
          <SongPicker
            height={MEDIA_ROW_HEIGHT}
            songFile={songFile}
            setSongFile={setSongFile}
          />
        </div>
        <Spacer size={UNIT * 2} />
        <div style={{ flexBasis: MEDIA_ROW_HEIGHT }}>
          <CoverArtPicker
            height={MEDIA_ROW_HEIGHT}
            coverArtFile={coverArtFile}
            setCoverArtFile={setCoverArtFile}
          />
        </div>
      </Row>
      <Spacer size={UNIT * 4} />
      <form onSubmit={handleSubmit}>
        <Row>
          <Cell>
            <Row>
              <Cell>
                <TextInput
                  required
                  label="Song name"
                  value={name}
                  placeholder="Radar"
                  onChange={ev => setSongName(ev.target.value)}
                />
              </Cell>
              <Spacer size={UNIT * 4} />
              <Cell>
                <TextInput
                  label="Song sub-name"
                  value={subName}
                  placeholder="(Original Mix)"
                  onChange={ev => setSongSubName(ev.target.value)}
                />
              </Cell>
            </Row>
            <Spacer size={UNIT * 4} />
            <Row>
              <Cell>
                <TextInput
                  required
                  label="Artist name"
                  value={artistName}
                  placeholder="Fox Stevenson"
                  onChange={ev => setArtistName(ev.target.value)}
                />
              </Cell>
              <Spacer size={UNIT * 4} />
              <Cell>
                <Row>
                  <Cell>
                    <TextInput
                      required
                      type="number"
                      label="BPM (Beats per Minute)"
                      value={bpm}
                      placeholder="140"
                      onChange={ev => setBpm(Number(ev.target.value))}
                    />
                  </Cell>
                  <Spacer size={UNIT * 4} />
                  <Cell>
                    <TextInput
                      label="Offset"
                      moreInfo="This is the number of milliseconds between the start of the audio file and the first beat of the map."
                      type="number"
                      value={offset}
                      placeholder="0"
                      onChange={ev => setOffset(Number(ev.target.value))}
                    />
                  </Cell>
                </Row>
              </Cell>
            </Row>
          </Cell>
        </Row>
        <Spacer size={UNIT * 4} />
        {/*
          I don't want `enter` to toggle one of the difficulty tag buttons,
          so they have to be lower in the DOM than the real submit button.
          But I also want them to be flipped visually, so I'm using flexbox
          to swap their onscreen position.
        */}
        <Flipped>
          <Center>
            <Button disabled={hasSubmitted}>
              {hasSubmitted ? <Spinner size={16} /> : 'Create new song'}
            </Button>
          </Center>
          <Spacer size={UNIT * 8} />
          <Row>
            <Label>
              Difficulty
              <QuestionTooltip>
                Select the first difficulty you'd like to work on. You can
                create additional difficulties later on.
              </QuestionTooltip>
            </Label>
            <Difficulties>
              {DIFFICULTIES.map(difficulty => (
                <React.Fragment key={difficulty}>
                  <DifficultyTag
                    disabled={hasSubmitted}
                    difficulty={difficulty}
                    onSelect={setSelectedDifficulty}
                    isSelected={
                      selectedDifficulty && selectedDifficulty === difficulty
                    }
                  />
                  <Spacer size={UNIT} />
                </React.Fragment>
              ))}
            </Difficulties>
          </Row>
        </Flipped>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Cell = styled.div`
  flex: 1;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 300;
  color: ${COLORS.gray[100]};
  display: flex;
  align-items: center;
`;

const Difficulties = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const Flipped = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const mapStateToProps = state => {
  return {
    currentSongIds: getAllSongIds(state),
  };
};

export default connect(
  mapStateToProps,
  { createNewSong: actions.createNewSong }
)(withRouter(AddSongForm));
