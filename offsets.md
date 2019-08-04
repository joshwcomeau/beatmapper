# On Offsets

Offsets are currently disabled because it's an annoying mess.

### Why they're important

Many songs don't start immediately on-beat; some songs have an arbitrary amount of "intro noise". Additionally, even many songs that start on-beat still have some small amount of silence added to the start of the file, to avoid clipping the start of the song.

The workaround for this problem is to add sufficient silence so that the song starts on an even number of beats. For example, if the song is 60bpm, there is 1 beat per second. If the song normally "starts" 200ms in, you can add an additional 800ms of silence, so that the song starts exactly 1 beat in.

This workaround is shitty, though, since it means that all of your measurements are 1 beat off. Most music follows patterns, and it can be helpful to jump to note 16 or 32; with 1 beat of offset, now you have to jump to 16.25 or 32.25.

### Why it's hard

the Beat Saber game doesn't play any sound before the offsets.

If you set your offset to be 2000ms in, that means the game **immediately** starts at that point. You don't get to hear the intro, and you're likely missing notes even before the screen has finished fading in. It's a mess.

The _correct_ behaviour would be for songs to still play from the very first instant.

Other editors have realized this, and they found a hack: they store the offset in a "custom data" field, `_difficultyBeatmapSets._difficultyBeatmaps._customData._editorOffset`. They set the actual offset to 0, and then offset all blocks by a suitable amount.

This means that a block that would normally start on Beat 2 instead starts on Beat 3.049285216 - the program does the calculations to figure out what 1000ms of offset is in Beats, using the BPM.

This hack is ideal for getting the song to play well, since it means Beat Saber will play the song from the very beginning, and hit you with notes at the right time; the notes will technically be "off-beat", but the song itself is offbeat by an opposite amount, so the two cancel each other out.

### Managing this

I kinda have to deal with this; otherwise, songs that users inport will have all their notes at weird offsets.

This is annoying because I need to decode this x_x

First, I should do a similar conversion myself, when exporting, so that songs with offsets are actually playable.
