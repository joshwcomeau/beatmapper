import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { getGridSize } from '../../reducers/songs.reducer';

import TextInput from '../TextInput';
import Spacer from '../Spacer';
import { UNIT } from '../../constants';
import MiniButton from '../MiniButton';

const GridConfig = ({
  finishTweakingGrid,
  numRows,
  numCols,
  colWidth,
  rowHeight,
  updateGrid,
  resetGrid,
}) => {
  return (
    <>
      <Buttons>
        <MiniButton onClick={resetGrid}>Reset</MiniButton>
      </Buttons>
      <Spacer size={UNIT * 4} />
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
  justify-content: center;

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
  };
};

const mapDispatchToProps = {
  updateGrid: actions.updateGrid,
  resetGrid: actions.resetGrid,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridConfig);
