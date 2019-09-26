---
id: manual
title: User Manual
sidebar_label: User Manual
---

Beatmapper is a web-based editor for Beat Saber, a VR rhythm game. This document is meant to be a 5-minute read that gives you all the context you'll need to get started making great maps!

## Getting started

To get started using Beatmapper, visit [beatmapper.app](https://beatmapper.app) (for best results, please use the Chrome browser). In the future, I plan to offer a downloadable, installable version, but that doesn't exist yet.

The easiest way to jump in and start experimenting is to **try the demo map**. Beatmapper comes with a fully-mapped-out song, and maybe the best way to get a hang of the app is to make modifications to this demo track.

You can also **import an existing map**, if you want to edit something you downloaded from Beatsaver, or transfer something from MediocreMapper or another editor (If so, you should check out the [Migrating from another editor](#migrating-from-another-editor) doc, to learn what makes Beatmapper different).

Most mappers will want to **create their own map** from scratch. This document will assume that this is your approach, and start from there. If you're using another option to get started, you can [jump ahead](#notes-view)

## Creating your first map

If you're creating a new map from scratch, you'll need to get some things in order. Specifically, you'll need:

- An audio file in `.ogg` format
- Some cover art, a square image in `.jpg` format

If you don't have any cover art, you can skip it, and a placeholder image will be used. You absolutely need an audio file to get started though.

You'll want to prepare the audio file so that there's a suitable amount of offset, and you'll also need to determine the song's BPM. For this and all information on song prep, see the [song prep guide](wip).

You'll need to select a difficulty. You can add more difficulties later, for now you only need to pick the one you'd like to start with.

## Notes view

The primary editor view is the **notes view**. This view allows you to add _blocks_, _mines_, and _obstacles_ to your map:

<img src="/docs/img/notes-view.png" style="width: 75%" />

The main area is taken up by a 3D representation of the notes in your song. You'll see the **placement grid** in the center; these 12 squares represent the possible positions for blocks and other elements. You can **left-click** the square to add a block to a specific square, at the current moment in time.

### Navigating time

There are many ways to move through time in the song:

- You can use the **spacebar** to play/pause the track. You can also hit the play button, in the center of the bottom panel.
- You can **scrub the waveform** by clicking and dragging to move quickly to another part of the song.
- You can **scroll with the mousewheel** (or use the fast-forward / rewind buttons by the play button) to jump forwards or backwards.

Scrolling with the mousewheel is the most precise way to select a specific bar/beat for placing blocks. An indicator on the right edge of the bottom panel shows you exactly where you're at:

<img src="/docs/img/time-bars.png" style="width: 163px" />

By default, every mouse-wheel tick will move you by _half of a beat_ forwards or backwards. You can control this by tweaking the _snapping interval_ on the left edge of the bottom panel:

<img src="/docs/img/snapping-interval.png" style="width: 194px" />

Clicking on the dropdown will show you all available options, as well as the corresponding keyboard shortcuts:

<img src="/docs/img/snapping-interval-shortcuts.png" style="width: 292px" />

> You can also shift between snapping intervals by holding `ctrl` (or `⌘` on Mac) and spinning the mousewheel. There are many helpful [keyboard shortcuts](/docs/docs/keyboard-shortcuts) available

### Navigating space

By default, the camera will be facing the placement grid head-on.

You can move the camera by **holding shift** and **using WASD**, as you might in a first-person shooter video game. You can also use **R** to rise up, and **F** to fall down (while still holding shift).

At any point, you can press **backspace** to return to the initial camera position, facing the placement grid.

### Placing blocks

To place a block, click on the corresponding square in the _placement grid_:

<img src="/docs/img/place-block.gif" style="width: 315px" />

Blocks can be placed in 8 cardinal directions, as well as a directionless "face" block. Blocks also come in two colors, corresponding to which saber they need to be struck with. You can select color and direction using the right sidebar:

<img src="/docs/img/tweak-color-and-direction.gif" style="width: 370px" />

You'll be changing color and direction quite a lot while mapping, so a number of conveniences are provided. First, you can use **keyboard shortcuts**:

- To switch between red and blue blocks, you can press `1` and `2` respectively. You can also press `tab` to move forward between tools (including mines and obstacles, which we'll learn about shortly), or `shift+tab` to move backwards between tools.
- To select a block direction, you can use the letters `WASD`. For example, you'd press `W` to select an "up" direction block. For diagonals, you can hold multiple keys: to select a top-left block, press both `W` and `A` at the same time.

You can swap the color of an existing block by clicking on it with the **middle mouse button**:

<img src="/docs/img/swap-block-color.gif" style="width: 400px" />

Finally, you can **click and drag** to dynamically select a block direction. This is my personal favourite way to place blocks:

<img src="/docs/img/drag-direction.gif" style="width: 400px" />

### Placing mines and obstacles

There are two other tools we need to familiarize ourselves with: **mines** and **obstacles**.

Mines are meant to be avoided by the sabers. You can select them from the right sidebar, or press `3` to select them. You can also cycle through tools with `tab` and `shift+tab`.

Mines don't have colors or directions, but otherwise they work just like blocks:

<img src="/docs/img/place-mine.gif" style="width: 307px" />

Obstacles are a bit different - they take up multiple cells at the same time, and come in two variants: **walls** and **ceilings**.

To place a wall, click and drag across the _bottom 2 rows_ in the placement grid:

<img src="/docs/img/place-obstacle.gif" style="width: 307px" />

> You'll notice that for walls, you're limited to placing walls that are 1 or 2 columns wide, no wider. This is a safety precaution; 3-column-thick walls can be hazardous, as folks try to leap out of the way. If you really want to place a super-wide wall, you'll need to do it in another editor.

Ceilings are placed the same way, but by clicking on the top row of squares. You can flip between ceilings and walls by moving the mouse up and down, before releasing:

<img src="/docs/img/place-ceiling.gif" style="width: 307px" />

#### Changing obstacle duration

By default, Obstacles will be **4 beats long**. You can resize them after placing the obstacle by clicking and dragging to the left or right:

<img src="/docs/img/obstacle-duration.gif" />

> This control respects the "snapping interval" selected in the bottom-left. If you wish to have more precision around obstacle duration, you can tweak this control.

In the future, I'll be adding additional ways to tweak obstacle duration.

### Selecting and deleting items

Blocks, mines, and obstacles all work the same way when it comes to selections and deletions.

To select items, you can click on them. Selected items turn yellow to indicate that they're selected:

<img src="/docs/img/select-intro.gif" style="width: 400px" />

> The number of selected items is shown in the sidebar. It's a good idea to keep an eye on this, to make sure you don't "forget" about selected notes you don't need selected anymore.

As a convenience, you can **click and hold** to select (or deselect) many items at once:

<img src="/docs/img/select-all.gif" style="width: 300px" />

To **clear your selection**, press the `Escape` key on your keyboard. You can also toggle between selecting all notes and no notes with `ctrl+A` (`⌘+A` on Mac)

To **delete selected items**, you can use the `Delete` key. Alternatively, you can also right-click items to delete them.

If you make a mistake deleting items, you can undo with `ctrl+Z` or `⌘+Z`.

You can **copy and paste** using the standard shortcuts for your operating system:

- `ctrl+c` or `⌘+c` to copy
- `ctrl+v` or `⌘+v` to cut (copies to the clipboard and deletes the blocks)
- `ctrl+p` or `⌘+p` to paste

### Miscellaneous helpers

At the very bottom of the screen, you'll find some numbers and controls:

![bottom bar](/docs/img/bottom-bar.png)

There's a bunch of helpful stuff down here:

- See how many of each item type you've placed
- See the "Note density" for the blocks currently on-screen (blocks per second)
- Play a tick sound-effect for every block
- Increase or decrease the spacing between beats
- Speed up or slow down the audio file
- Control the song volume

#### Tick sound effect caveats

Among the miscellaneous helpers, you'll notice the ability to toggle a "tick" sound effect for every block:

<img src="/docs/img/tick-toggle.png" style="width: 137px" />

There are **two important caveats** for this control:

- The sound effect will be slightly delayed, anywhere from 20ms to 80ms. As a result, this control _should not_ be used for sychronizing your music to your notes; if you synchronize it to this sound, it will be off-beat in-game.
- The ticking sound effect only triggers for notes that are a multiple of 1/4 beat notes (so 1/4, 1/2, 1, ...). It will not trigger for 1/3rd notes, nor for more-precise notes like 1/8, 1/16...

These two facts mean that the ticking sound effect isn't super useful right now. It's definitely on the list of things to improve.

## Events view

> This documentation is a work-in-progress. The events view is not covered in enough detail yet, so some experimentation will be required.

The sidebar on the left contains the links to other views:

<img src="/docs/img/sidebar.png" style="width: 111px" />

Let's visit the third icon in the list, to view the **events view**:

<img src="/docs/img/events-view.png" style="width: 75%" />

### Navigation

A thick vertical yellow bar represents the current timestamp; if you press `Space` to play the song, you'll see it tracks the song position.

By default, the events grid will show **16 beats of a song**. When the yellow bar reaches the end of that 16-beat window, it jumps immediately to the next 16 beat window.

You can increase or decrease the number of beats shown in the window using the zoom-in / zoom-out buttons in the top-right of the grid.

### Track types

In the Events view, there are 9 tracks that give you control over different events. They come in 3 flavors:

#### Lighting tracks

<img src="/docs/img/light-track.png" style="max-width: 75%" />

These tracks allow you to turn a light on and off. There are 5 lighting tracks:

- Left laser
- Right laser
- Back laser
- Primary light
- Track neons

> These names might not always be accurate; different environments place the lights differently. These labels are only guaranteed to be correct for the default environment, although they're generally pretty close.

Lighting tracks are the most complicated, because they support **4 event types**:

- **on**: Turns a light on at medium brightness
- **off**: Turns a light off
- **flash**: Briefly sets the light to maximum brightness, fading to medium brightness. Turns a light on, if it wasn't already on.
- **fade**: Briefly sets the light to maximum brightness, fading out completely. Turns a light off, if it was already on.

Additionally, on/flash/fade can be given a color, either **red** or **blue**.

You can switch between colors and event types using the toolbar above the tracks, or via keyboard shortcuts:

- `1`: Set event type to **on**
- `2`: Set event type to **on**
- `3`: Set event type to **on**
- `4`: Set event type to **on**
- `Tab` / `Shift+Tab`: Cycle through event types
- `R`: Set color to `red`
- `B`: Set color to `blue`

#### Ring tracks

<img src="/docs/img/ring-track.png" style="max-width: 75%" />

There are two ring tracks, _large ring_ and _small ring_. There is only 1 event type for these tracks, which triggers a rotation event. This is a very coarse control; you do not have the ability to change the speed of the rotation, nor can you stop a rotation currently in progress. You can think of it as a button on a video game controller; press "A" to punch. You can control how often you press the button, but that's about it.

#### Laser speed tracks

<img src="/docs/img/speed-track.png" style="max-width: 75%" />

There are two laser-speed tracks, _left laser speed_ and _right laser speed_. As you might expect, these are associated with the lighting tracks _left laser_ and _right laser_.

Each track has 9 possible values: the numbers 0 through 8, inclusive. These values set the speed of their corresponding laser; 0 means that the laser is not moving, 8 means that the laser is swinging rapidly through the environment.

Speed tracks have no effect when their corresponding lighting track is off.

### Placing and managing events

There are two editing modes:

- `Add` (keyboard shortcut: `A`): Place new events on the tracks
- `Select` (keyboard shortcut: `S`): Select existing events

#### Add mode

Add mode is the primary mode, and it allows you to place and delete events across all tracks. Left click to add the selected event type and color to the current track, at the current time.

As you move your cursor across the grid, you'll notice a white vertical line following the cursor. This is the `selected beat`; when you click to add events, it will be added precisely to the beat indicated by the white line. By default, this line jumps by 1/2 beat at a time, but you can change this by tweaking the "snapping interval" dropdown, in the same place as the notes view:

<img src="/docs/img/snapping-interval.png" style="width: 194px" />

Some additional things to know:

- You can right-click to delete individual events, although it might be faster to use `Select` mode, described below
- You can tap the middle-click button while hovering over a lighting event to toggle its color between red and blue
- You can place multiple blocks within a single track by clicking and dragging in an empty space. Blocks will be placed according to the snapping interval.
- You can delete multiple blocks within a single track by right-clicking and dragging
- Laser speed tracks work a little bit differently; clicking and dragging controls the position of a single event.

#### Select mode

Select mode is a great way to make batch modifications to the events in the current window. Clicking and dragging creates a dotted box, and any events within this box when you release the mouse button are selected. You can tell which events are selected because they inherit a soft yellow glow, similar to the blocks in the notes view.

Selected blocks can be manipulated in a few ways, discussed in the next section:

### Moving selected notes

> In the future, I hope to expand the functionality in this area. Right now, bulk note management is fairly limited

With notes selected, you can delete them with the `delete` key, cut or copy them with standard operating-system shortcuts:

- `ctrl+c` or `⌘+c` to copy
- `ctrl+v` or `⌘+v` to cut (copies to the clipboard and deletes the blocks)
- `ctrl+p` or `⌘+p` to paste

Important to note, events are pasted based on the mouse position (the thin vertical line), not the song position (the thick yellow line).

In the future, I hope to allow notes to be moved from left to right, or even across tracks, but this functionality is not yet built.
