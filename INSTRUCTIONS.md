# Transferring songs to the Quest

(This is mainly instructions for me, Josh. But I've included them here for anyone else working on custom songs for the Quest).

### Song formatting

You need to get your files in v2 format, and zipped together. This is done automatically by Beatmapper, but not by MM / EditSaber / other map software. If you've imported your Beatmapper map into another editor to work on the lighting, you'll need to convert the files to v2.

Currently, you can use SideQuest to do this - the old "Custom Levels" button. Open the local songs folder, and drag your v1 file over. Click the "refresh" icon; it'll tell you "Error: No info.dat found". Click it again and it'll convert the files.

Open the songs folder to find your new files (you can tell it's converted since it'll rename info.json to info.dat). Select all relevant files and compress them into a .zip. Do it on the files directly, not the parent folder.

### Transferring to Beat On

Go to the Beat On URL. This can be found in SideQuest in the top-left corner (should look like http://192.168.1.134:50000). Navigate to the "Upload" tab and drop the new .zip file onto it.

Click Sync to Beat Saber for it to update the files.

### Playing your map

You'll need to restart Beat Saber to view edits to existing songs.

Note that there may be an issue where if the filename hasn't changed, it won't recognize it as a new map. I'm working on solving this in Beat Mapper (essentially adding a metadata field with a "mapVersion" property, so that the info.dat changes on every edit).
