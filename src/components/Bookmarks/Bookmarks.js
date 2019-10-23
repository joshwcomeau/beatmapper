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
}) => {
  return bookmarks.map(bookmark => {
    const beatNumWithOffset = bookmark.beatNum + offsetInBeats;
    const offsetPercentage = (beatNumWithOffset / durationInBeats) * 100;

    return (
      <BookmarkFlag
        key={bookmark.beatNum}
        bookmark={bookmark}
        offsetPercentage={offsetPercentage}
        handleClick={() => jumpToBeat(bookmark.beatNum)}
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

const mapDispatchToProps = state => ({
  jumpToBeat: actions.jumpToBeat,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookmarks);
