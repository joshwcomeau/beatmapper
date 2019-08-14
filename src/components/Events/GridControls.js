import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Color from 'color';
import { Icon } from 'react-icons-kit';
import { zoomIn as zoomInIcon } from 'react-icons-kit/feather/zoomIn';
import { zoomOut as zoomOutIcon } from 'react-icons-kit/feather/zoomOut';

import * as actions from '../../actions';
import { UNIT, EVENTS_VIEW, COLORS } from '../../constants';
import {
  getSelectedEventTool,
  getSelectedEventColor,
  getZoomLevel,
} from '../../reducers/editor.reducer';
import Spacer from '../Spacer';

import ControlItem from './ControlItem';
import ControlItemToggleButton from './ControlItemToggleButton';
import EventToolIcon from './EventToolIcon';
import UnstyledButton from '../UnstyledButton';

const GridControls = ({
  contentWidth,
  selectedTool,
  selectedColor,
  zoomLevel,
  selectTool,
  selectColor,
  zoomIn,
  zoomOut,
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

        <ControlItem label="Effect">
          <ControlItemToggleButton
            value="on"
            isToggled={selectedTool === 'on'}
            onToggle={() => selectTool(EVENTS_VIEW, 'on')}
          >
            <EventToolIcon
              tool="on"
              color={
                selectedColor === 'red' ? COLORS.red[500] : COLORS.blue[500]
              }
            />
          </ControlItemToggleButton>
          <ControlItemToggleButton
            value="off"
            isToggled={selectedTool === 'off'}
            onToggle={() => selectTool(EVENTS_VIEW, 'off')}
          >
            <EventToolIcon
              tool="off"
              color={
                selectedColor === 'red' ? COLORS.red[500] : COLORS.blue[500]
              }
            />
          </ControlItemToggleButton>
          <ControlItemToggleButton
            value="flash"
            isToggled={selectedTool === 'flash'}
            onToggle={() => selectTool(EVENTS_VIEW, 'flash')}
          >
            <EventToolIcon
              tool="flash"
              color={
                selectedColor === 'red' ? COLORS.red[500] : COLORS.blue[500]
              }
            />
          </ControlItemToggleButton>
          <ControlItemToggleButton
            value="fade"
            isToggled={selectedTool === 'fade'}
            onToggle={() => selectTool(EVENTS_VIEW, 'fade')}
          >
            <EventToolIcon
              tool="fade"
              color={
                selectedColor === 'red' ? COLORS.red[500] : COLORS.blue[500]
              }
            />
          </ControlItemToggleButton>
        </ControlItem>
      </Left>

      <Right />
      <ControlItem label="Zoom" align="right">
        <ZoomBtn onClick={zoomOut} disabled={zoomLevel === 1}>
          <Icon size={14} icon={zoomOutIcon} />
        </ZoomBtn>
        <ZoomBtn onClick={zoomIn} disabled={zoomLevel === 4}>
          <Icon size={14} icon={zoomInIcon} />
        </ZoomBtn>
      </ControlItem>
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

const ZoomBtn = styled(UnstyledButton)`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: ${COLORS.blueGray[900]};
  color: ${COLORS.blueGray[100]};
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    opacity: 0.5;
  }

  & svg {
    display: block !important;
  }
`;

const mapStateToProps = state => {
  return {
    selectedTool: getSelectedEventTool(state),
    selectedColor: getSelectedEventColor(state),
    zoomLevel: getZoomLevel(state),
  };
};

const mapDispatchToProps = {
  selectTool: actions.selectTool,
  selectColor: actions.selectEventColor,
  zoomIn: actions.zoomIn,
  zoomOut: actions.zoomOut,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridControls);
