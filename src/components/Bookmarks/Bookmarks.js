import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { convertMillisecondsToBeats } from '../../helpers/audio.helpers';
import { getSortedBookmarksArray } from '../../reducers/bookmarks.reducer';
import { getDurationInBeats } from '../../reducers/navigation.reducer';
import { getSelectedSong } from '../../reducers/songs.reducer';

import BookmarkFlag from './BookmarkFlag';

const Bookmarks = ({
  bookmarks,
  durationInBeats,
  offsetInBeats,
  jumpToBeat,
  deleteBookmark,
}) => {
  // Add the bookmarks in reverse.
  // This way, they stack from left to right, so earlier flags sit in front of
  // later ones. This is important when hovering, to be able to see the flag
  // name
  return [...bookmarks].reverse().map(bookmark => {
    const beatNumWithOffset = bookmark.beatNum + offsetInBeats;
    const offsetPercentage = (beatNumWithOffset / durationInBeats) * 100;

    return (
      <BookmarkFlag
        key={bookmark.beatNum}
        bookmark={bookmark}
        offsetPercentage={offsetPercentage}
        handleJump={() => jumpToBeat(bookmark.beatNum)}
        handleDelete={() => deleteBookmark(bookmark.beatNum)}
      />
    );
  });
};

const mapStateToProps = state => {
  const selectedSong = getSelectedSong(state);
  const offsetInBeats = convertMillisecondsToBeats(
    selectedSong.offset,
    selectedSong.bpm
  );

  return {
    bookmarks: getSortedBookmarksArray(state),
    durationInBeats: getDurationInBeats(state),
    offsetInBeats,
  };
};

const mapDispatchToProps = {
  jumpToBeat: actions.jumpToBeat,
  deleteBookmark: actions.deleteBookmark,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookmarks);
