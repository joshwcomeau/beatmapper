import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';

import * as actions from '../../actions';
import { UNIT, EVENTS_VIEW, COLORS } from '../../constants';
import {
  getSelectedEventTool,
  getSelectedEventColor,
} from '../../reducers/editor.reducer';
import MiniButton from '../MiniButton';
import Spacer from '../Spacer';

import ControlItem from './ControlItem';
import ControlItemToggleButton from './ControlItemToggleButton';

const PADDING = UNIT * 2;

const LIGHT_TOOLS = [
  {
    id: 'on',
    label: 'On',
  },
  {
    id: 'off',
    label: 'Off',
  },
  {
    id: 'flash',
    label: 'Flash',
  },
  {
    id: 'fade',
    label: 'Fade',
  },
];

const GridControls = ({
  contentWidth,
  selectedTool,
  selectedColor,
  selectTool,
  selectColor,
}) => {
  return (
    <Wrapper style={{ width: contentWidth }}>
      <Left>
        <ControlItem label="Light Color">
          <ControlItemToggleButton
            value="red"
            isToggled={selectedColor === 'red'}
            onToggle={selectColor}
          >
            <Box color={COLORS.red[500]} />
          </ControlItemToggleButton>
          <ControlItemToggleButton
            value="blue"
            isToggled={selectedColor === 'blue'}
            onToggle={selectColor}
          >
            <Box color={COLORS.blue[500]} />
          </ControlItemToggleButton>
        </ControlItem>
        <Spacer size={UNIT * 4} />
        <ControlItem label="Light Color">
          <ControlItemToggleButton
            value="red"
            isToggled={selectedColor === 'red'}
            onToggle={selectColor}
          >
            <Box color={COLORS.red[500]} />
          </ControlItemToggleButton>
          <ControlItemToggleButton
            value="blue"
            isToggled={selectedColor === 'blue'}
            onToggle={selectColor}
          >
            <Box color={COLORS.blue[500]} />
          </ControlItemToggleButton>
        </ControlItem>
      </Left>

      <Right />
      <ButtonRow>
        {LIGHT_TOOLS.map(({ id, label }) => (
          <React.Fragment key={id}>
            <MiniButton
              color={selectedTool === id ? COLORS.blue[700] : undefined}
              hoverColor={selectedTool === id ? COLORS.blue[500] : undefined}
              onClick={() => selectTool(EVENTS_VIEW, id)}
            >
              {label}
            </MiniButton>
            <Spacer size={UNIT} />
          </React.Fragment>
        ))}
      </ButtonRow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  padding: 0 ${UNIT * 2}px;
`;

const Left = styled.div`
  display: flex;
`;
const Right = styled.div``;

const ButtonRow = styled.div`
  display: flex;
  align-self: center;
`;

const Box = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    0deg,
    ${props =>
      Color(props.color)
        .darken(0.2)
        .hsl()
        .string()},
    ${props =>
      Color(props.color)
        .lighten(0.1)
        .hsl()
        .string()}
  );
`;

const mapStateToProps = state => {
  return {
    selectedTool: getSelectedEventTool(state),
    selectedColor: getSelectedEventColor(state),
  };
};

const mapDispatchToProps = {
  selectTool: actions.selectTool,
  selectColor: actions.selectEventColor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridControls);
