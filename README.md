# Beat Mapper

## A 3D editor for creating Beat Saber maps

// Add screenshot

Beat Saber is a VR rhythm game in which the player strikes blocks with lightsabers to music. The original game comes with around 20 songs, which is woefully insufficient!

A community of modders has sprung up to bring custom music to the game. Each new song requires a "map" - a set of data files controlling the placement of blocks, mines, obstacles, and lighting events. This project is software that can be used to create maps.

### Getting started / Demo

Beatmapper works entirely in-browser; there is nothing to download, nor is there a backend. You can get started now at https://beatmapper.app. On your first visit, you'll be able to play around with a demo song, to get a feel for the editor.

### Why?

There are several editors already in existence, including an official one. Why make another one?

- Cross-platform support. This editor is the only editor that works on MacOS and Linux (some other editors don't even work in a Windows VM!)
- Get started effortlessly. The most popular editor took me about 15 minutes to get working, and requires evading 2 toolbar installation requests. By contrast, Beatmapper is available in-browser, requires <1mb of total download including assets. It even comes with a demo track, so you can start playing around immediately!
- Focus on user experience. While I am not a UX designer by trade, I believe that usability is important. I've run into a number of glaring UX problems using the other third-party editors, and I hope to produce an app that is much less frustrating to use.
- Full compatibility. Beatmapper exports both available Beat Saber file formats, which means you can transfer exported maps directly to your Beat Saber device, or import them into other editors. You can also import existing maps in both formats.

I'm creating Beatmapper primarily for myself, for fun. Bug reports and feature requests are appreciated, but please understand, I work on this when I want to, and feel no pressure to resolve any issues you may be experiencing. There's still a lot of work to do (see "upcoming features"), and there is no timetable.

### Features

- a rich, high-fidelity 3D editing experience.
- Exists entirely in-browser, no downloads or dependencies required. Once the page is loaded, you don't even need an internet connection!
- supports v1 and v2 map formats, does not require any conversions ever.
- Create new tracks or import existing ones. Update all properties for your songs
- Full-width waveform gives you a bird's eye view of the track.
- Navigation tools, including the ability to change your snapping interval, jump to a specific bar number, or scrub through the waveform in realtime
- Fullly supports blocks, mines, and obstacles.
- Ability to swap selections of notes both horizontally and vertically.
- Intuitive mouse and keyboard bindings for advanced users to get work done quickly.

### Upcoming features

There's still a lot to do!

- Events. A new view is in the works to modify lighting and ring movement. I have some really novel ideas that should be incredibly powerful, stay tuned!
- Playtest mode. A VR-compatible alternative view that tries to mimic the Beat Saber experience, so that you can playtest the map without needing to transfer your map to a VR device (for those with standalone headsets like the Quest)
- Bookmarks
- BPM changes
- Improved selection controls
- Time signature customizations

### How to use

_Full, proper guide coming soon_

Visit https://beatmapper.app/ to use the application.

You'll be prompted to either create a new song, import an existing map, or experiment with the demo track. The easiest way to get started poking around is to try the demo track, but we'll assume in this README that you're creating a song from scratch

##### Song prep

Before you can start mapping, you need to prepare your assets and make sure you have all the info you need.

You'll likely want to download and install [Audacity](https://www.audacityteam.org/), a free open-source cross-platform audio editor. You need to make sure you have a song file in `.ogg` format, since this is the only format Beat Saber understands.

You can also search the internet for a suitable cover image, and make sure it's at least 250x250px and in `.jpg` format.

Next, we need a few pieces of additional information: **BPM** and **offset**.

BPM (Beats Per Minute) is the tempo of the song. You can sometimes find this information by googling, or by using an [online tool](http://www.beatsperminuteonline.com/) to tap out the beats as you listen to the song.

Offset is the amount of time, in milliseconds, between the start of the song file, and the very first beat. Most songs will have a small natural delay in them, while others might have 10 seconds of ambient intro. If the song _does_ start immediately, it's generally advisable to generate some silence using Audacity to make sure the player isn't overwhelmed with blocks right off the bat.

Once you have your prepared assets and are armed with all the info you need, click the "Create new song" button and fill in the form. You'll also need to select a difficulty, but don't worry too much about this. You can add additional difficulties later on.

##### Basic editor controls

The primary view in the editor displays all the notes, mines, and obstacles in your track in a 3D perspective view. Near the front, you'll see a 3x4 grid. This grid is known as the _placement grid_, and clicking on it will place items.

The right-hand panel is your _tool menu_ and it lets you select the "cut direction" you want blocks to face, as well as the type of item to place (red block, blue block, mine, or obstacle). You can also use keyboard shortcuts to access these items: use `WASD` to select block cut direction, and the numbers `1-4` to select specific items. You can also press `Tab` to tab between item types.
