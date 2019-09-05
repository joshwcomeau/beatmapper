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

#### Navigating time

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

#### Navigating space

By default, the camera will be facing the placement grid head-on.

You can move the camera by **holding shift** and **using WASD**, as you might in a first-person shooter video game. You can also use **R** to rise up, and **F** to fall down (while still holding shift).

At any point, you can press **backspace** to return to the initial camera position, facing the placement grid.

#### Placing blocks

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

#### Placing mines and obstacles

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

#### Selecting and deleting items

Blocks, mines, and obstacles all work the same way when it comes to selections and deletions.

To select items, you can click on them. Selected items turn yellow to indicate that they're selected:

<img src="/docs/img/select-intro.gif" style="width: 400px" />

> The number of selected items is shown in the sidebar. It's a good idea to keep an eye on this, to make sure you don't "forget" about selected notes you don't need selected anymore.

As a convenience, you can **click and hold** to select (or deselect) many items at once:

<img src="/docs/img/select-all.gif" style="width: 300px" />

To **clear your selection**, press the `Escape` key on your keyboard. You can also toggle between selecting all notes and no notes with `ctrl+A` (`⌘+A` on Mac)

To **delete selected items**, you can use the `Delete` key. Alternatively, you can also right-click items to delete them.

If you make a mistake deleting items, you can undo with `ctrl+Z` or `⌘+Z`.

#### Miscellaneous helpers

At the very bottom of the screen, you'll find some numbers and controls:

![bottom bar](/docs/img/bottom-bar.png)

There's a bunch of helpful stuff down here:

- See how many of each item type you've placed
- See the "Note density" for the blocks currently on-screen (blocks per second)
- Play a tick sound-effect for every block
- Increase or decrease the spacing between beats
- Speed up or slow down the audio file
- Control the song volume

## Events view

The sidebar on the left contains the links to other views:

<img src="/docs/img/sidebar.png" style="width: 111px" />

Let's visit the third icon in the list, to view the **events view**:

<img src="/docs/img/events-view.png" style="width: 75%" />

## Migrating from another editor

WIP
