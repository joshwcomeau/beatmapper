export const BOOKMARK_COLORS = [
  { background: '#F50057', text: 'white' }, // pink
  { background: '#FFEA00', text: 'black' }, // yellow
  { background: '#D500F9', text: 'white' }, // purple
  { background: '#64DD17', text: 'black' }, // green
  { background: '#0091EA', text: 'white' }, // blue
  { background: '#FF9100', text: 'black' }, // orange
];

export const getNewBookmarkColor = bookmarks => {
  // I have 6 unique colors, and it's important that these are the first-used
  // colors. Beyond that, we can be a little less careful, since most songs
  // won't get up this high anyway.
  if (bookmarks.length >= 6) {
    return BOOKMARK_COLORS[bookmarks.length % BOOKMARK_COLORS.length];
  }

  const firstUnusedColor = BOOKMARK_COLORS.find(color => {
    const isColorUnused = bookmarks.every(
      bookmark => bookmark.color.background !== color.background
    );

    return isColorUnused;
  });

  return firstUnusedColor;
};

export const convertBookmarksToExportableJson = bookmarks => {
  return (bookmarks || []).map(bookmark => {
    return {
      _time: bookmark.beatNum,
      _name: bookmark.name,
      __meta: {
        color: bookmark.color,
      },
    };
  });
};

export const convertBookmarksToRedux = bookmarks => {
  return (bookmarks || []).map((bookmark, i) => {
    let color = bookmark.__meta && bookmark.__meta.color;

    // If we're parsing bookmarks created outside of Beatmapper, we won't yet
    // have assigned colors.
    if (!color) {
      color = BOOKMARK_COLORS[i % BOOKMARK_COLORS.length];
    }

    return {
      beatNum: bookmark._time,
      name: bookmark._name,
      color,
    };
  });
};
