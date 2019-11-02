import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { getGridSize } from '../../reducers/songs.reducer';

import TextInput from '../TextInput';
import Spacer from '../Spacer';
import { UNIT } from '../../constants';
import MiniButton from '../MiniButton';

const GridConfig = ({ finishTweakingGrid, numRows, numCols, updateGrid }) => {
  return (
    <>
      <Row>
        <TextInput
          type="number"
          min={1}
          max={30}
          label="Columns"
          value={numCols}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(Number(ev.target.value), numRows);
          }}
        />
        <Spacer size={UNIT * 4} />
        <TextInput
          type="number"
          min={1}
          max={30}
          label="Rows"
          value={numRows}
          onKeyDown={ev => {
            ev.stopPropagation();
          }}
          onChange={ev => {
            updateGrid(numCols, Number(ev.target.value));
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
  };
};

const mapDispatchToProps = {
  updateGrid: actions.updateGrid,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridConfig);
