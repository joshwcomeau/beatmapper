import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { arrowUpLeft } from 'react-icons-kit/feather/arrowUpLeft';
import { arrowUp } from 'react-icons-kit/feather/arrowUp';
import { arrowUpRight } from 'react-icons-kit/feather/arrowUpRight';
import { arrowLeft } from 'react-icons-kit/feather/arrowLeft';
import { arrowRight } from 'react-icons-kit/feather/arrowRight';
import { arrowDownLeft } from 'react-icons-kit/feather/arrowDownLeft';
import { arrowDown } from 'react-icons-kit/feather/arrowDown';
import { arrowDownRight } from 'react-icons-kit/feather/arrowDownRight';
import { circle } from 'react-icons-kit/feather/circle';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import {
  getSelectedNoteTool,
  getSelectedCutDirection,
} from '../../reducers/editor.reducer';

import IconButton from '../IconButton';
import Spacer from '../Spacer';
import Heading from '../Heading';

const NoteGrid = ({
  selectedDirection,
  selectedNoteTool,
  selectNoteDirection,
}) => {
  const isDisabled =
    selectedNoteTool !== 'left-block' &&
    selectedNoteTool !== 'right-block' &&
    selectedNoteTool !== 'red-block' &&
    selectedNoteTool !== 'blue-block';

  return (
    <Wrapper>
      <Heading size={3}>Notes</Heading>

      <Spacer size={UNIT * 1.5} />

      <Grid>
        <Row>
          <IconButton
            disabled={isDisabled}
            icon={arrowUpLeft}
            isToggled={selectedDirection === 4}
            onClick={() => selectNoteDirection(4)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={arrowUp}
            isToggled={selectedDirection === 0}
            onClick={() => selectNoteDirection(0)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={arrowUpRight}
            isToggled={selectedDirection === 5}
            onClick={() => selectNoteDirection(5)}
          />
        </Row>
        <Spacer size={1} />
        <Row>
          <IconButton
            disabled={isDisabled}
            icon={arrowLeft}
            isToggled={selectedDirection === 2}
            onClick={() => selectNoteDirection(2)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={circle}
            isToggled={selectedDirection === 8}
            onClick={() => selectNoteDirection(8)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={arrowRight}
            isToggled={selectedDirection === 3}
            onClick={() => selectNoteDirection(3)}
          />
          <Spacer size={1} />
        </Row>
        <Spacer size={1} />
        <Row>
          <IconButton
            disabled={isDisabled}
            icon={arrowDownLeft}
            isToggled={selectedDirection === 6}
            onClick={() => selectNoteDirection(6)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={arrowDown}
            isToggled={selectedDirection === 1}
            onClick={() => selectNoteDirection(1)}
          />
          <Spacer size={1} />
          <IconButton
            disabled={isDisabled}
            icon={arrowDownRight}
            isToggled={selectedDirection === 7}
            onClick={() => selectNoteDirection(7)}
          />
          <Spacer size={1} />
        </Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div``;

const Row = styled.div`
  display: flex;
`;

const mapStateToProps = state => ({
  selectedNoteTool: getSelectedNoteTool(state),
  selectedDirection: getSelectedCutDirection(state),
});

const mapDispatchToProps = { selectNoteDirection: actions.selectNoteDirection };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteGrid);
