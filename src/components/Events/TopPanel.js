import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT, EVENTS_VIEW, COLORS } from '../../constants';
import { getSelectedEventTool } from '../../reducers/editor.reducer';
import MiniButton from '../MiniButton';
import Spacer from '../Spacer';

const PADDING = UNIT * 2;

const LIGHT_TOOLS = [
  {
    id: 'light-on',
    label: 'On',
  },
  {
    id: 'light-off',
    label: 'Off',
  },
  {
    id: 'light-on-off',
    label: 'On/off',
  },
];

const EventsTopPanel = ({ contentWidth, selectedTool, selectTool }) => {
  return (
    <Wrapper style={{ width: contentWidth }}>
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
  flex: 1;
  height: 120px;
  display: flex;
  justify-content: space-between;
  padding-top: ${PADDING}px;
  background: rgba(255, 255, 255, 0.1);
  user-select: none;
`;

const ButtonRow = styled.div`
  display: flex;
  align-self: center;
`;

const mapStateToProps = state => {
  return {
    selectedTool: getSelectedEventTool(state),
  };
};

const mapDispatchToProps = {
  selectTool: actions.selectTool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsTopPanel);
