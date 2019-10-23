import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSortedBookmarksArray } from '../../reducers/bookmarks.reducer';
import { getDurationInBeats } from '../../reducers/navigation.reducer';
import BookmarkFlag from './BookmarkFlag';

const Bookmarks = ({ bookmarks, durationInBeats, jumpToBeat }) => {
  return bookmarks.map(bookmark => {
    // Our Bookmark component needs to be given its position
    const offsetPercentage = (bookmark.beatNum / durationInBeats) * 100;

    console.log(bookmark.beatNum, durationInBeats);

    return (
      <BookmarkFlag
        bookmark={bookmark}
        offsetPercentage={offsetPercentage}
        handleClick={() => jumpToBeat(bookmark.beatNum)}
      />
    );
  });
};

const mapStateToProps = state => ({
  bookmarks: getSortedBookmarksArray(state),
  durationInBeats: getDurationInBeats(state),
});

const mapDispatchToProps = state => ({
  jumpToBeat: actions.jumpToBeat,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookmarks);
