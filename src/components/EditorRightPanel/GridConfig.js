import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { getMappingExtensions } from '../../reducers/editor.reducer';

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
            updateGrid(ev.target.value, numRows);
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
            updateGrid(numCols, ev.target.value);
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
