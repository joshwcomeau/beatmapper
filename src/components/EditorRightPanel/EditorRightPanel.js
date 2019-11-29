import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UNIT } from '../../constants';
import {
  getSelectedBlocks,
  getSelectedMines,
  getSelectedObstacles,
} from '../../reducers/editor-entities.reducer/notes-view.reducer';
import useOnChange from '../../hooks/use-on-change.hook';
import { getSelectedSong, getMappingMode } from '../../reducers/songs.reducer';

import NoteGrid from '../NoteGrid';
import ItemGrid from '../ItemGrid';
import Spacer from '../Spacer';

import Actions from './Actions';
import SelectionInfo from './SelectionInfo';
import GridConfig from './GridConfig';
import useOnKeydown from '../../hooks/use-on-keydown.hook';

// HACK: This should be a constant somewhere, used to set bottom panel
// height!
const bottomPanelHeight = 180;

const EditorRightPanel = ({
  song,
  mappingMode,
  numOfSelectedBlocks,
  numOfSelectedMines,
  numOfSelectedObstacles,
  isAnythingSelected,
}) => {
  // This panel adapts based on the current situation.
  let panelContents;

  const [showGridConfig, setShowGridConfig] = React.useState(false);

  useOnChange(() => {
    if (showGridConfig && isAnythingSelected) {
      // If the user selects something while the grid panel is open,
      // switch to the selection panel
      setShowGridConfig(false);
    }
  }, numOfSelectedBlocks + numOfSelectedMines + numOfSelectedObstacles);

  useOnKeydown(
    'KeyG',
    () => {
      if (mappingMode === 'mapping-extensions') {
        setShowGridConfig(currentVal => !currentVal);
      }
    },
    [mappingMode]
  );

  if (showGridConfig) {
    panelContents = (
      <GridConfig finishTweakingGrid={() => setShowGridConfig(false)} />
    );
  } else if (isAnythingSelected) {
    panelContents = (
      <SelectionInfo
        numOfSelectedBlocks={numOfSelectedBlocks}
        numOfSelectedMines={numOfSelectedMines}
        numOfSelectedObstacles={numOfSelectedObstacles}
      />
    );
  } else {
    panelContents = (
      <>
        <NoteGrid />
        <Spacer size={UNIT * 4} />
        <ItemGrid />
        <Spacer size={UNIT * 4} />
        <Actions
          song={song}
          handleGridConfigClick={() => setShowGridConfig(true)}
        />
      </>
    );
  }

  return (
    <OuterWrapper
      onWheel={ev => {
        // On smaller windows, the content won't fit in the side panel.
        // By default we disable all mousewheel action since it causes problems
        // with our main view, but if the cursor is over this panel, we'll
        // allow it to behave normally by not bubbling that event to the
        // window handler (which prevents it).
        ev.stopPropagation();
      }}
    >
      <Wrapper>{panelContents}</Wrapper>
    </OuterWrapper>
  );
};

const OuterWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: ${bottomPanelHeight}px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
`;

const Wrapper = styled.div`
  color: #fff;
  padding: ${UNIT * 4}px ${UNIT * 3}px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: ${UNIT}px 0 0 ${UNIT}px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  overflow: auto;
  pointer-events: auto;
`;

const mapStateToProps = state => {
  const selectedBlocks = getSelectedBlocks(state);
  const selectedMines = getSelectedMines(state);
  const selectedObstacles = getSelectedObstacles(state);

  const isAnythingSelected =
    selectedBlocks.length > 0 ||
    selectedObstacles.length > 0 ||
    selectedMines.length > 0;

  return {
    song: getSelectedSong(state),
    mappingMode: getMappingMode(state),
    numOfSelectedBlocks: selectedBlocks.length,
    numOfSelectedMines: selectedMines.length,
    numOfSelectedObstacles: selectedObstacles.length,
    isAnythingSelected,
  };
};

export default connect(mapStateToProps)(EditorRightPanel);
