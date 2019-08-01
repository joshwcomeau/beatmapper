import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { COLORS, UNIT } from '../../constants';
import * as actions from '../../actions';

import IconButton from '../IconButton';
import Spacer from '../Spacer';
import Heading from '../Heading';

import BlockIcon from './BlockIcon';
import MineIcon from './MineIcon';
import ObstacleIcon from './ObstacleIcon';

const ItemGrid = ({ selectedTool, selectPlacementTool }) => {
  const buttonSize = 36;
  return (
    <Wrapper>
      <Heading size={3}>Items</Heading>

      <Spacer size={UNIT * 1.5} />

      <Grid>
        <Row>
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'red-block'}
            onClick={() => selectPlacementTool('red-block')}
          >
            <BlockIcon color={COLORS.red[500]} />
          </IconButton>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'blue-block'}
            onClick={() => selectPlacementTool('blue-block')}
          >
            <BlockIcon color={COLORS.blue[500]} />
          </IconButton>
        </Row>
        <Spacer size={1} />
        <Row>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'mine'}
            onClick={() => selectPlacementTool('mine')}
          >
            <MineIcon size={20} />
          </IconButton>
          <Spacer size={1} />
          <IconButton
            size={buttonSize}
            isToggled={selectedTool === 'obstacle'}
            onClick={() => selectPlacementTool('obstacle')}
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
  selectedTool: state.editor.notes.selectedTool,
});

const mapDispatchToProps = { selectPlacementTool: actions.selectPlacementTool };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemGrid);
