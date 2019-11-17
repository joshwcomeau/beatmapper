# Timing

I've struggled a lot with handling precise block times. This guide exists to help me understand/remember the problems, and present a manual test plan for validating solutions.

### The issue

Sometimes, a note will be very slightly off-beat; it's not an amount that is noticeable to players, but it _does_ mean that it's possible to put 2+ notes in the exact same spot. It means notes can appear greyed out even though they're right at the placement grid. It's just weird that notes don't stay where you put them

### The cause

There are many causes:

- Notes put on 1/3rd notes are at an endlessly-repeating time (eg. 11.333333). This gets rounded
- Converting between real time in seconds and "game time" in beats causes floating-point imprecision. You'll see times like 12.0000000001
- When saving and reloading the song, the times are converted back and forth and can take on slightly different values
- Songs can have offsets and those offsets are added to the game time (and then removed on reload), this can cause slight variations.

### New solution

The aggressive option is this: Round everything to the closest 1/64th beat.

1/64 is the same as `0.015625`, which is not an endlessly repeating value. So that solves one class of issue right there.

If I do the conversion _on click_, right as the note is created, **and** on load, when every note is converted / de-offset/everything else, I should ensure that I can convert back and forth without any drift.

I'll also need to update the SongBlocks so that a note that is 1/64th or less ahead of the curve is still visible / not greyed-out, but I think I already did this.

### Test plan

How will I know if my solution actually works? Ideally I'd have automated tests, but life is hard and this is a side-project.

For verification, I need to check two things:

1. I can't create two notes on the same time marker. I should get a console warning letting me know it was rejected, and the total note count shouldn't increase. I should try clicking the space around the notes, AND trying to drag-in-a-direction
2. Notes on the current marker should always be fully opaque, and notes that are 1/32nd in the past should be transparent.

For now, run through the following flows:

##### Flow 1: Saving and reloading

- Working on a map with no offset, create several notes at 1 beat, 1/2 beat, 1/4 beat, and 1/8 beat.
- Return to the home screen, load a different map.
- Return home and reload the current map.
- Verify
- Save the map to disk. Delete the current map. Reupload. Repeat verification.

##### Flow 2: 1/3rd notes

- Same as Flow 1, except use 1/3rd, 1/6th, and 1/12th notes

##### Flow 3: With offset

- Same as Flow 2, but using a song that has an offset, and one that isn't smoothly divided by the BPM (Only Now should work).
