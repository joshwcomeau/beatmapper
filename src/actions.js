import uuid from 'uuid/v1';

import { NOTES_VIEW, EVENTS_VIEW } from './constants';
import { getSelection } from './reducers/editor-entities.reducer';
import {
  getNotes,
  getObstacles,
} from './reducers/editor-entities.reducer/notes-view.reducer';
import { getAllEventsAsArray } from './reducers/editor-entities.reducer/events-view.reducer';
import { getSelectedSong } from './reducers/songs.reducer';
import { getCopiedData } from './reducers/clipboard.reducer';
import {
  getCursorPositionInBeats,
  getDurationInBeats,
} from './reducers/navigation.reducer';
import {
  getSelectedEventBeat,
  getStartAndEndBeat,
  getBeatsPerZoomLevel,
} from './reducers/editor.reducer';

export const loadDemoSong = () => ({
  type: 'LOAD_DEMO_SONG',
});

export const createNewSong = (
  coverArtFilename,
  coverArtFile,
  songFilename,
  songFile,
  songId,
  name,
  subName,
  artistName,
  bpm,
  offset,
  selectedDifficulty
) => ({
  type: 'CREATE_NEW_SONG',
  coverArtFilename,
  coverArtFile,
  songFilename,
  songFile,
  songId,
  name,
  subName,
  artistName,
  bpm,
  offset,
  selectedDifficulty,
  createdAt: Date.now(),
  lastOpenedAt: Date.now(),
});
export const updateSongDetails = (
  songId,
  name,
  subName,
  artistName,
  mapAuthorName,
  bpm,
  offset,
  swingAmount,
  swingPeriod,
  previewStartTime,
  previewDuration,
  environment,
  difficultiesById
) => ({
  type: 'UPDATE_SONG_DETAILS',
  songId,
  name,
  subName,
  artistName,
  mapAuthorName,
  bpm,
  offset,
  swingAmount,
  swingPeriod,
  previewStartTime,
  previewDuration,
  environment,
  difficultiesById,
});

export const startImportingSong = () => ({
  type: 'START_IMPORTING_SONG',
});

export const importExistingSong = songData => ({
  type: 'IMPORT_EXISTING_SONG',
  songData,
  createdAt: Date.now(),
  lastOpenedAt: Date.now(),
});

export const clearEntities = () => ({
  type: 'CLEAR_ENTITIES',
});

export const changeSelectedDifficulty = (songId, difficulty) => ({
  type: 'CHANGE_SELECTED_DIFFICULTY',
  songId,
  difficulty,
});
export const createDifficulty = (difficulty, afterCreate) => ({
  type: 'CREATE_DIFFICULTY',
  difficulty,
  afterCreate,
});

export const startLoadingSong = (songId, difficulty) => ({
  type: 'START_LOADING_SONG',
  songId,
  difficulty,
});

export const loadBeatmapEntities = (notes, events, obstacles) => ({
  type: 'LOAD_BEATMAP_ENTITIES',
  notes,
  events,
  obstacles,
});

export const finishLoadingSong = (song, duration, waveformData) => ({
  type: 'FINISH_LOADING_SONG',
  song,
  duration,
  waveformData,
  lastOpenedAt: Date.now(),
});

export const startPlaying = () => ({
  type: 'START_PLAYING',
});

export const pausePlaying = () => ({
  type: 'PAUSE_PLAYING',
});
export const togglePlaying = () => ({
  type: 'TOGGLE_PLAYING',
});

export const cutSelection = view => (dispatch, getState) => {
  const selection = getSelection(getState(), view);

  return dispatch({
    type: 'CUT_SELECTION',
    view,
    data: selection,
  });
};
export const copySelection = view => (dispatch, getState) => {
  const selection = getSelection(getState(), view);

  return dispatch({
    type: 'COPY_SELECTION',
    view,
    data: selection,
  });
};
export const pasteSelection = view => (dispatch, getState) => {
  const state = getState();

  const data = getCopiedData(state);

  // If there's nothing copied, do nothing
  if (!data) {
    return;
  }

  // When pasting in notes view, we want to paste at the cursor position, where
  // the song is currently playing. For the events view, we want to paste it
  // where the mouse cursor is, the selected beat.
  const pasteAtBeat =
    view === NOTES_VIEW
      ? getCursorPositionInBeats(state)
      : getSelectedEventBeat(state);

  // Every entity that has an ID (obstacles, events) needs a unique ID, we
  // shouldn't blindly copy it over.
  const uniqueData = data.map(item => {
    if (typeof item.id === 'undefined') {
      return item;
    }

    return {
      ...item,
      id: uuid(),
    };
  });

  return dispatch({
    type: 'PASTE_SELECTION',
    view,
    data: uniqueData,
    pasteAtBeat,
  });
};

export const adjustCursorPosition = newCursorPosition => ({
  type: 'ADJUST_CURSOR_POSITION',
  newCursorPosition,
});

export const clickPlacementGrid = (
  rowIndex,
  colIndex,
  cursorPositionInBeats,
  selectedDirection,
  selectedTool
) => ({
  type: 'CLICK_PLACEMENT_GRID',
  rowIndex,
  colIndex,
  cursorPositionInBeats,
  selectedDirection,
  selectedTool,
});

export const setBlockByDragging = (
  direction,
  rowIndex,
  colIndex,
  cursorPositionInBeats,
  selectedTool
) => ({
  type: 'SET_BLOCK_BY_DRAGGING',
  direction,
  rowIndex,
  colIndex,
  cursorPositionInBeats,
  selectedTool,
});

export const zoomWaveform = amount => ({
  type: 'ZOOM_WAVEFORM',
  amount,
});

export const scrubWaveform = newOffset => ({
  type: 'SCRUB_WAVEFORM',
  newOffset,
});

export const scrubEventsHeader = selectedBeat => ({
  type: 'SCRUB_EVENTS_HEADER',
  selectedBeat,
});

export const scrollThroughSong = direction => ({
  type: 'SCROLL_THROUGH_SONG',
  direction,
});

export const skipToStart = () => (dispatch, getState) => {
  const state = getState();
  const song = getSelectedSong(state);
  const offset = song.offset || 0;

  dispatch({
    type: 'SKIP_TO_START',
    offset,
  });
};
export const skipToEnd = () => ({
  type: 'SKIP_TO_END',
});

export const changeSnapping = newSnapTo => ({
  type: 'CHANGE_SNAPPING',
  newSnapTo,
});
export const incrementSnapping = () => ({
  type: 'INCREMENT_SNAPPING',
});
export const decrementSnapping = () => ({
  type: 'DECREMENT_SNAPPING',
});

export const selectNoteDirection = direction => ({
  type: 'SELECT_NOTE_DIRECTION',
  direction,
});
export const selectTool = (view, tool) => ({
  type: 'SELECT_TOOL',
  view,
  tool,
});
export const selectNextTool = view => ({
  type: 'SELECT_NEXT_TOOL',
  view,
});
export const selectPreviousTool = view => ({
  type: 'SELECT_PREVIOUS_TOOL',
  view,
});

export const clickNote = (clickType, time, lineLayer, lineIndex) => ({
  type: 'CLICK_NOTE',
  clickType,
  time,
  lineLayer,
  lineIndex,
});
export const mouseOverNote = (time, lineLayer, lineIndex) => ({
  type: 'MOUSE_OVER_NOTE',
  time,
  lineLayer,
  lineIndex,
});

export const toggleNoteColor = (time, lineLayer, lineIndex) => ({
  type: 'TOGGLE_NOTE_COLOR',
  time,
  lineLayer,
  lineIndex,
});

export const selectNote = (time, lineLayer, lineIndex) => ({
  type: 'SELECT_NOTE',
  time,
  lineLayer,
  lineIndex,
});
export const deselectNote = (time, lineLayer, lineIndex) => ({
  type: 'DESELECT_NOTE',
  time,
  lineLayer,
  lineIndex,
});
export const selectObstacle = id => ({
  type: 'SELECT_OBSTACLE',
  id,
});
export const deselectObstacle = id => ({
  type: 'DESELECT_OBSTACLE',
  id,
});

export const deselectAll = view => ({
  type: 'DESELECT_ALL',
  view,
});
export const selectAll = view => (dispatch, getState) => {
  const state = getState();

  // For the events view, we don't actually want to select EVERY note. We
  // only want to select what is visible in the current frame.
  let metadata = null;

  if (view === EVENTS_VIEW) {
    const { startBeat, endBeat } = getStartAndEndBeat(state);
    metadata = { startBeat, endBeat };
  }

  dispatch({
    type: 'SELECT_ALL',
    view,
    metadata,
  });
};
export const toggleSelectAll = view => (dispatch, getState) => {
  const state = getState();

  let anythingSelected;

  if (view === NOTES_VIEW) {
    const notes = getNotes(state);
    const obstacles = getObstacles(state);

    const anyNotesSelected = notes.some(n => n.selected);
    const anyObstaclesSelected = obstacles.some(s => s.selected);

    anythingSelected = anyNotesSelected || anyObstaclesSelected;
  } else if (view === EVENTS_VIEW) {
    const events = getAllEventsAsArray(state);

    anythingSelected = events.some(e => e.selected);
  }

  if (anythingSelected) {
    dispatch(deselectAll(view));
  } else {
    dispatch(selectAll(view));
  }
};

export const selectAllInRange = (view, start, end) => ({
  type: 'SELECT_ALL_IN_RANGE',
  view,
  start,
  end,
});

export const deleteNote = (time, lineLayer, lineIndex) => ({
  type: 'DELETE_NOTE',
  time,
  lineLayer,
  lineIndex,
});
export const bulkDeleteNote = (time, lineLayer, lineIndex) => ({
  type: 'BULK_DELETE_NOTE',
  time,
  lineLayer,
  lineIndex,
});

export const deleteSelectedNotes = () => ({
  type: 'DELETE_SELECTED_NOTES',
});

export const startManagingNoteSelection = selectionMode => ({
  type: 'START_MANAGING_NOTE_SELECTION',
  selectionMode,
});
export const finishManagingNoteSelection = () => ({
  type: 'FINISH_MANAGING_NOTE_SELECTION',
});

export const moveMouseAcrossEventsGrid = selectedBeat => ({
  type: 'MOVE_MOUSE_ACROSS_EVENTS_GRID',
  selectedBeat,
});

export const downloadMapFiles = ({ version = 2, songId }) => ({
  type: 'DOWNLOAD_MAP_FILES',
  version,
  songId,
});

export const updateBeatmapMetadata = (
  songId,
  difficulty,
  noteJumpSpeed,
  startBeatOffset
) => ({
  type: 'UPDATE_BEATMAP_METADATA',
  songId,
  difficulty,
  noteJumpSpeed,
  startBeatOffset,
});
export const deleteBeatmap = (songId, difficulty) => ({
  type: 'DELETE_BEATMAP',
  songId,
  difficulty,
});

export const updatePlaybackSpeed = playbackRate => ({
  type: 'UPDATE_PLAYBACK_SPEED',
  playbackRate,
});
export const updateBeatDepth = beatDepth => ({
  type: 'UPDATE_BEAT_DEPTH',
  beatDepth,
});
export const updateVolume = volume => ({
  type: 'UPDATE_VOLUME',
  volume,
});

export const createNewObstacle = (
  mouseDownAt,
  mouseOverAt,
  cursorPositionInBeats
) => {
  if (!mouseOverAt) {
    mouseOverAt = mouseDownAt;
  }

  // TODO: Dedupe with the code in `TentativeObstacle`
  const lane = Math.min(mouseDownAt.colIndex, mouseOverAt.colIndex);

  const colspan = Math.abs(mouseDownAt.colIndex - mouseOverAt.colIndex) + 1;

  const obstacle = {
    id: uuid(),
    lane,
    type: mouseOverAt.rowIndex === 2 ? 'ceiling' : 'wall',
    beatStart: cursorPositionInBeats,
    beatDuration: 4,
    colspan,
  };

  // Clamp our wall colspan to a max of 2
  if (obstacle.type === 'wall' && obstacle.colspan > 2) {
    const overBy = obstacle.colspan - 2;
    obstacle.colspan = 2;

    const colspanDelta = mouseOverAt.colIndex - mouseDownAt.colIndex;

    if (colspanDelta > 0) {
      obstacle.lane += overBy;
    } else {
      obstacle.lane = mouseOverAt.colIndex;
    }
  }

  return {
    type: 'CREATE_NEW_OBSTACLE',
    obstacle,
  };
};

export const deleteObstacle = id => ({
  type: 'DELETE_OBSTACLE',
  id,
});

export const resizeObstacle = (id, newBeatDuration) => ({
  type: 'RESIZE_OBSTACLE',
  id,
  newBeatDuration,
});

export const undoNotes = () => ({
  type: 'UNDO_NOTES',
});
export const redoNotes = () => ({
  type: 'REDO_NOTES',
});
export const undoEvents = () => ({
  type: 'UNDO_EVENTS',
});
export const redoEvents = () => ({
  type: 'REDO_EVENTS',
});

export const deleteSong = songId => ({
  type: 'DELETE_SONG',
  songId,
});

export const toggleNoteTick = () => ({
  type: 'TOGGLE_NOTE_TICK',
});

export const leaveEditor = () => ({
  type: 'LEAVE_EDITOR',
});

export const swapSelectedNotes = axis => ({
  type: 'SWAP_SELECTED_NOTES',
  axis,
});

export const jumpToBar = barNum => ({
  type: 'JUMP_TO_BAR',
  barNum,
});

export const seekForwards = view => ({
  type: 'SEEK_FORWARDS',
  view,
});
export const seekBackwards = view => ({
  type: 'SEEK_BACKWARDS',
  view,
});

export const unloadSong = () => ({
  type: 'UNLOAD_SONG',
});

export const placeEvent = (
  trackId,
  beatNum,
  eventType,
  eventColor,
  eventLaserSpeed
) => {
  return {
    type: 'PLACE_EVENT',
    id: uuid(),
    trackId,
    beatNum,
    eventType,
    eventColor,
    eventLaserSpeed,
  };
};
export const changeLaserSpeed = (trackId, beatNum, speed) => {
  return {
    type: 'CHANGE_LASER_SPEED',
    id: uuid(),
    trackId,
    beatNum,
    speed,
  };
};

export const deleteEvent = (id, trackId) => ({
  type: 'DELETE_EVENT',
  id,
  trackId,
});
export const bulkDeleteEvent = (id, trackId) => ({
  type: 'BULK_DELETE_EVENT',
  id,
  trackId,
});
export const deleteSelectedEvents = () => ({
  type: 'DELETE_SELECTED_EVENTS',
});

export const selectEvent = (id, trackId) => ({
  type: 'SELECT_EVENT',
  id,
  trackId,
});
export const deselectEvent = (id, trackId) => ({
  type: 'DESELECT_EVENT',
  id,
  trackId,
});
export const selectColor = (view, color) => ({
  type: 'SELECT_COLOR',
  view,
  color,
});

export const switchEventColor = (id, trackId) => ({
  type: 'SWITCH_EVENT_COLOR',
  id,
  trackId,
});
export const selectEventColor = color => selectColor(EVENTS_VIEW, color);

export const selectEventEditMode = editMode => ({
  type: 'SELECT_EVENT_EDIT_MODE',
  editMode,
});
export const zoomIn = () => ({
  type: 'ZOOM_IN',
});
export const zoomOut = () => ({
  type: 'ZOOM_OUT',
});

export const drawSelectionBox = (selectionBox, selectionBoxInBeats) => (
  dispatch,
  getState
) => {
  const state = getState();

  const { startBeat, endBeat } = getStartAndEndBeat(state);
  const metadata = { window: { startBeat, endBeat } };

  dispatch({
    type: 'DRAW_SELECTION_BOX',
    selectionBox,
    selectionBoxInBeats,
    metadata,
  });
};

export const clearSelectionBox = () => ({
  type: 'CLEAR_SELECTION_BOX',
});

export const commitSelection = () => ({
  type: 'COMMIT_SELECTION',
});

export const dismissPrompt = promptId => ({
  type: 'DISMISS_PROMPT',
  promptId,
});
