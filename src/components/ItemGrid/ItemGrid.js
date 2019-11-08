import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UNIT, NOTES_VIEW } from '../../constants';
import * as actions from '../../actions';

import IconButton from '../IconButton';
import Spacer from '../Spacer';
import Heading from '../Heading';

import BlockIcon from './BlockIcon';
import MineIcon from './MineIcon';
import ObstacleIcon from './ObstacleIcon';
import { getSelectedSong } from '../../reducers/songs.reducer';
import { getColorForItem } from '../../helpers/colors.helpers';

const ItemGrid = ({ song, selectedTool, selectTool }) => {
  const buttonSize = 36;
  return (
    <Wrapper>
      <Heading size={3}>Items</Heading>

      <Spacer size={UNIT * 1.5} />

      <Grid>
        <Row>
          <IconButton
            size={buttonSize}
            isToggled={
              selectedTool === 'left-block' || selectedTool === 'red-block'
            }
            onClick={() => selectTool(NOTES_VIEW, 'left-block')}
          >
            <BlockIcon color={getColorForItem('left-block', song)} />
          </IconButton>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={
              selectedTool === 'right-block' || selectedTool === 'blue-block'
            }
            onClick={() => selectTool(NOTES_VIEW, 'right-block')}
          >
            <BlockIcon color={getColorForItem('right-block', song)} />
          </IconButton>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'mine'}
            onClick={() => selectTool(NOTES_VIEW, 'mine')}
          >
            <MineIcon size={20} />
          </IconButton>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'obstacle'}
            onClick={() => selectTool(NOTES_VIEW, 'obstacle')}
          >
            <ObstacleIcon size={20} />
          </IconButton>
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
  song: getSelectedSong(state),
  selectedTool: state.editor.notes.selectedTool,
});

const mapDispatchToProps = { selectTool: actions.selectTool };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemGrid);
