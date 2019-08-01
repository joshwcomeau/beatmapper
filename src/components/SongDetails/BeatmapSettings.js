import React from 'react';
import styled from 'styled-components';

import { UNIT, COLORS } from '../../constants';

import TextInput from '../TextInput';
import Heading from '../Heading';
import Spacer from '../Spacer';
import MiniButton from '../MiniButton';

const BeatmapSettings = ({
  id,
  dirty,
  noteJumpSpeed,
  startBeatOffset,
  handleChangeNoteJumpSpeed,
  handleChangeStartBeatOffset,
  handleSaveBeatmap,
  handleCopyBeatmap,
  handleDeleteBeatmap,
}) => {
  return (
    <Wrapper>
      <Heading size={3}>{id}</Heading>
      <Spacer size={UNIT * 3} />
      <TextInput
        type="number"
        label="Note jump speed"
        value={noteJumpSpeed}
        onChange={ev => handleChangeNoteJumpSpeed(ev.target.value)}
      />
      <Spacer size={UNIT * 3} />
      <TextInput
        type="number"
        label="Start beat offset"
        value={startBeatOffset}
        onChange={ev => handleChangeStartBeatOffset(ev.target.value)}
      />
      <Spacer size={UNIT * 3} />
      <Row>
        <MiniButton disabled={!dirty} onClick={ev => handleSaveBeatmap(ev, id)}>
          Save
        </MiniButton>
        <Spacer size={UNIT * 2} />
        <MiniButton onClick={ev => handleCopyBeatmap(ev, id)}>Copy</MiniButton>
        <Spacer size={UNIT * 2} />
        <MiniButton
          color={COLORS.red[700]}
          hoverColor={COLORS.red[500]}
          onClick={ev => handleDeleteBeatmap(ev, id)}
        >
          Delete
        </MiniButton>
      </Row>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: ${UNIT * 3}px;
  margin-right: ${UNIT * 4}px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

export default BeatmapSettings;
