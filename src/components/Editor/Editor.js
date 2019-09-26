import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';

import * as actions from '../../actions';
import { SIDEBAR_WIDTH, COLORS } from '../../constants';
import { getSelectedSong } from '../../reducers/songs.reducer';

import Sidebar from '../Sidebar';
import NotesEditor from '../NotesEditor';
import Events from '../Events';
import Preview from '../Preview';
import SongDetails from '../SongDetails';
import Download from '../Download';
import LoadingScreen from '../LoadingScreen';
import EditorPrompts from '../EditorPrompts';

import EditorErrors from './EditorErrors';

const Editor = ({
  songId,
  difficulty,
  isCorrectSongSelected,
  startLoadingSong,
  leaveEditor,
}) => {
  // HACK: We're duplicating the state between the URL (/edit/:songId) and Redux
  // (state.songs.selectedId). This is because having the URL as the sole
  // source of truth was a HUGE pain in the butt. This way is overall much
  // nicer, but it has this one big issue: syncing the state initially.
  //
  // Our locally-persisted state might be out of date. We need to fix that
  // before we do anything else.
  React.useEffect(() => {
    startLoadingSong(songId, difficulty);
  }, [startLoadingSong, songId, difficulty]);

  React.useEffect(() => {
    return () => {
      leaveEditor();
    };
  }, [leaveEditor]);

  if (!isCorrectSongSelected) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Sidebar />

      <Wrapper>
        <EditorErrors>
          <Switch>
            <Route
              path="/edit/:songId/:difficulty/notes"
              component={NotesEditor}
            />
            <Route path="/edit/:songId/:difficulty/events" component={Events} />
            <Route
              path="/edit/:songId/:difficulty/preview"
              component={Preview}
            />
            <Route
              path="/edit/:songId/:difficulty/details"
              component={SongDetails}
            />
            <Route
              path="/edit/:songId/:difficulty/download"
              component={Download}
            />
          </Switch>
        </EditorErrors>
      </Wrapper>

      <EditorPrompts />
    </>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${SIDEBAR_WIDTH}px;
  right: 0;
  bottom: 0;
  background: ${COLORS.blueGray[1000]};
`;

const mapStateToProps = (state, ownProps) => {
  const songIdFromUrl = ownProps.match.params.songId;
  const difficultyFromUrl = ownProps.match.params.difficulty;

  const selectedSongFromRedux = getSelectedSong(state);

  const isCorrectSongSelected =
    selectedSongFromRedux && songIdFromUrl === selectedSongFromRedux.id;

  return {
    songId: songIdFromUrl,
    difficulty: difficultyFromUrl,
    isCorrectSongSelected,
  };
};

const mapDispatchToProps = {
  startLoadingSong: actions.startLoadingSong,
  leaveEditor: actions.leaveEditor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
