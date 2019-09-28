import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

import * as actions from '../../actions';
import { UNIT, NOTES_VIEW } from '../../constants';
import {
  promptQuickSelect,
  promptJumpToBeat,
} from '../../helpers/prompts.helpers';

import MiniButton from '../MiniButton';
import Heading from '../Heading';
import Spacer from '../Spacer';

const Actions = ({ selectAllInRange, jumpToBeat }) => {
  return (
    <Wrapper>
      <Heading size={3}>Actions</Heading>
      <Spacer size={UNIT * 1.5} />

      <Tooltip
        delay={[500, 0]}
        title="Select everything over a time period (Q)"
      >
        <MiniButton
          onClick={() => promptQuickSelect(NOTES_VIEW, selectAllInRange)}
        >
          Select Range
        </MiniButton>
      </Tooltip>

      <Spacer size={UNIT} />

      <Tooltip delay={[500, 0]} title="Jump to a specific beat number (J)">
        <MiniButton onClick={() => promptJumpToBeat(jumpToBeat)}>
          Jump to Beat
        </MiniButton>
      </Tooltip>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const mapDispatchToProps = {
  selectAllInRange: actions.selectAllInRange,
  jumpToBeat: actions.jumpToBeat,
};

export default connect(
  null,
  mapDispatchToProps
)(Actions);
