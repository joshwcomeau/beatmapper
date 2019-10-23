import {
  BOOKMARK_COLORS,
  getNewBookmarkColor,
  convertBookmarksToExportableJson,
  convertBookmarksToRedux,
} from './bookmarks.helpers';

describe('Bookmarks helpers', () => {
  describe('getNewBookmarkColor', () => {
    it('returns the first color for the first bookmark', () => {
      const bookmarks = [];

      expect(getNewBookmarkColor(bookmarks)).toBe(BOOKMARK_COLORS[0]);
    });

    it('returns the third color when the first two are used', () => {
      const bookmarks = [
        { name: 'first', color: BOOKMARK_COLORS[0] },
        { name: 'second', color: BOOKMARK_COLORS[1] },
      ];

      expect(getNewBookmarkColor(bookmarks)).toBe(BOOKMARK_COLORS[2]);
    });

    it('Fills in a hole, if a value was deleted', () => {
      const bookmarks = [
        { name: 'first', color: BOOKMARK_COLORS[0] },
        { name: 'second', color: BOOKMARK_COLORS[1] },
        { name: 'third', color: BOOKMARK_COLORS[2] },
      ];

      // Delete the middle item.
      // Bookmarks will now be [first, third].
      bookmarks.splice(1, 1);

      // It should pick the 2nd color, to fill in the missing one.
      expect(getNewBookmarkColor(bookmarks)).toBe(BOOKMARK_COLORS[1]);
    });

    it('picks the first value for the 7th bookmark', () => {
      // This test relies on randomness! This is a hard thing to test.
      // Rather than be 100% definitive, I'm going to be 99.9999% definitive.
      const bookmarks = [
        { name: 'first', color: BOOKMARK_COLORS[0] },
        { name: 'second', color: BOOKMARK_COLORS[1] },
        { name: 'third', color: BOOKMARK_COLORS[2] },
        { name: 'fourth', color: BOOKMARK_COLORS[3] },
        { name: 'fifth', color: BOOKMARK_COLORS[4] },
        { name: 'sixth', color: BOOKMARK_COLORS[5] },
      ];

      expect(getNewBookmarkColor(bookmarks)).toBe(BOOKMARK_COLORS[0]);
    });
  });

  describe('convertBookmarksToExportableJson', () => {
    it('Converts bookmarks correctly', () => {
      const bookmarks = [
        {
          beatNum: 32,
          name: 'buildup',
          color: { background: '#F00', text: '#000' },
        },
        {
          beatNum: 128,
          name: 'drop',
          color: { background: '#F00', text: '#000' },
        },
      ];

      expect(convertBookmarksToExportableJson(bookmarks)).toEqual([
        {
          _time: 32,
          _name: 'buildup',
          __meta: { color: { background: '#F00', text: '#000' } },
        },
        {
          _time: 128,
          _name: 'drop',
          __meta: { color: { background: '#F00', text: '#000' } },
        },
      ]);
    });
  });

  describe('convertBookmarksToRedux', () => {
    it('Converts bookmarks correctly', () => {
      const bookmarks = [
        { _time: 32, _name: 'buildup' },
        { _time: 128, _name: 'drop' },
      ];

      expect(convertBookmarksToRedux(bookmarks)).toEqual([
        {
          beatNum: 32,
          name: 'buildup',
          color: BOOKMARK_COLORS[0],
        },
        {
          beatNum: 128,
          name: 'drop',
          color: BOOKMARK_COLORS[1],
        },
      ]);
    });
  });
});
