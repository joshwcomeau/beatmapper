import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getMappingExtensions } from '../../reducers/editor.reducer';

import TextInput from '../TextInput';
import Spacer from '../Spacer';
import { UNIT } from '../../constants';
import MiniButton from '../MiniButton';

const GridConfig = ({ finishTweakingGrid, numRows, numCols, updateGrid }) => {
  return (
    <>
      <TextInput
        required
        type="number"
        min={1}
        max={30}
        label="# of Columns"
        value={numCols}
        onKeyDown={ev => {
          ev.stopPropagation();
        }}
        onChange={ev => {
          updateGrid(ev.target.value, numRows);
        }}
      />
      <Spacer size={UNIT * 2} />
      <TextInput
        required
        type="number"
        min={1}
        max={30}
        label="# of Rows"
        value={numRows}
        onKeyDown={ev => {
          ev.stopPropagation();
        }}
        onChange={ev => {
          updateGrid(numCols, ev.target.value);
        }}
      />
      <Spacer size={UNIT * 4} />
      <MiniButton onClick={finishTweakingGrid}>Finish</MiniButton>
    </>
  );
};

const mapStateToProps = state => {
  const mappingExtensions = getMappingExtensions(state);

  return {
    numRows: mappingExtensions.numRows,
    numCols: mappingExtensions.numCols,
  };
};

const mapDispatchToProps = {
  updateGrid: actions.updateGrid,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridConfig);
