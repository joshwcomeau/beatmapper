import { BOOKMARK_COLORS, getNewBookmarkColor } from './bookmarks.helpers';

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

    it('picks a random value for the 7th bookmark', () => {
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

      const seenValues = {};

      for (let i = 0; i < 100; i++) {
        const randomColor = getNewBookmarkColor(bookmarks);
        seenValues[randomColor.background] = true;
      }

      // After 100 random generations, I should have at least 2 different
      // colors.
      // For this test to fail (when the code actually works), I'd have to
      // roll the 6-sided dice 100 times and wind up with the same value
      // every time.
      const numOfUniqueSeenColors = Object.keys(seenValues).length;

      expect(numOfUniqueSeenColors).toBeGreaterThan(1);
    });
  });
});
