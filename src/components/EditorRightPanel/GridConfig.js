import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { GRID_PRESET_SLOTS } from '../../constants';
import { getGridSize } from '../../reducers/songs.reducer';
import { getGridPresets } from '../../reducers/editor.reducer';
import { promptSaveGridPreset } from '../../helpers/prompts.helpers';

import TextInput from '../TextInput';
import Spacer from '../Spacer';
import { UNIT } from '../../constants';
import MiniButton from '../MiniButton';
import Heading from '../Heading';
import Center from '../Center';
import SpacedChildren from '../SpacedChildren';

const GridConfig = ({
  finishTweakingGrid,
  numRows,
  numCols,
  colWidth,
  rowHeight,
  gridPresets,
  updateGrid,
  resetGrid,
  saveGridPreset,
  loadGridPreset,
  deleteGridPreset,
}) => {
  const showPresets = Object.keys(gridPresets).length > 0;

  return (
    <>
      <Buttons>
        <MiniButton onClick={resetGrid}>Reset</MiniButton>
      </Buttons>
      <Spacer size={UNIT * 4} />

      {showPresets && (
        <Center>
          <Heading size={3}>Presets</Heading>
          <Spacer size={UNIT * 1.5} />
          <Row>
            <SpacedChildren>
              {GRID_PRESET_SLOTS.map(slot => (
                <MiniButton
                  key={slot}
                  disabled={!gridPresets[slot]}
                  onClick={ev => {
                    if (ev.buttons === 0) {
                      loadGridPreset(gridPresets[slot]);
                    }
                  }}
                  onContextMenu={ev => {
                    ev.preventDefault();
                    deleteGridPreset(slot);
                  }}
                >
                  {slot}
                </MiniButton>
              ))}
            </SpacedChildren>
          </Row>
          <Spacer size={UNIT * 4} />
        </Center>
      )}

      <Row>
        <TextInput
          type="number"
          min={1}
          max={40}
          label="Columns"
          value={numCols}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(Number(ev.target.value), numRows, colWidth, rowHeight);
          }}
        />
        <Spacer size={UNIT * 2} />
        <TextInput
          type="number"
          min={1}
          max={11}
          label="Rows"
          value={numRows}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(numCols, Number(ev.target.value), colWidth, rowHeight);
          }}
        />
      </Row>
      <Spacer size={UNIT * 3} />
      <Row>
        <TextInput
          type="number"
          min={0.1}
          max={4}
          step={0.1}
          label="Cell Width"
          value={colWidth}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(numCols, numRows, Number(ev.target.value), rowHeight);
          }}
        />
        <Spacer size={UNIT * 2} />
        <TextInput
          type="number"
          min={0.1}
          max={4}
          step={0.1}
          label="Cell Height"
          value={rowHeight}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(numCols, numRows, colWidth, Number(ev.target.value));
          }}
        />
      </Row>

      <Spacer size={UNIT * 4} />
      <Buttons>
        <MiniButton
          onClick={() => promptSaveGridPreset(gridPresets, saveGridPreset)}
        >
          Save Preset
        </MiniButton>
        <Spacer size={UNIT * 1} />
        <MiniButton onClick={finishTweakingGrid}>Finish Customizing</MiniButton>
      </Buttons>
    </>
  );
};

const Row = styled.div`
  display: flex;

  label {
    flex: 1;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  i,
  svg {
    display: block !important;
  }
`;

const mapStateToProps = state => {
  const gridSize = getGridSize(state);

  return {
    numRows: gridSize.numRows,
    numCols: gridSize.numCols,
    colWidth: gridSize.colWidth,
    rowHeight: gridSize.rowHeight,
    gridPresets: getGridPresets(state),
  };
};

const mapDispatchToProps = {
  updateGrid: actions.updateGrid,
  resetGrid: actions.resetGrid,
  saveGridPreset: actions.saveGridPreset,
  loadGridPreset: actions.loadGridPreset,
  deleteGridPreset: actions.deleteGridPreset,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridConfig);
