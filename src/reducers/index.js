import { combineReducers } from 'redux';

import songs from './songs.reducer';
import clipboard from './clipboard.reducer';
import editorEntities from './editor-entities.reducer';
import waveform from './waveform.reducer';
import navigation from './navigation.reducer';
import editor from './editor.reducer';
import global from './global.reducer';
import user from './user.reducer';
import bookmarks from './bookmarks.reducer';

export default combineReducers({
  songs,
  clipboard,
  editorEntities,
  waveform,
  navigation,
  editor,
  global,
  user,
  bookmarks,
});
