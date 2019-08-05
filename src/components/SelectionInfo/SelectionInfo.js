import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { maximize2 } from 'react-icons-kit/feather/maximize2';

import * as actions from '../../actions';
import { COLORS, UNIT, NOTES_VIEW } from '../../constants';
import { getNumOfSelectedNotes } from '../../reducers/editor-entities.reducer';

import MiniButton from '../MiniButton';
import Heading from '../Heading';
import IconButton from '../IconButton';
import Spacer from '../Spacer';

const NotesText = ({ numOfSelectedItems }) => {
  let text;
  if (numOfSelectedItems === 0) {
    text = '––';
  } else if (numOfSelectedItems === 1) {
    text = (
      <>
        <Highlight>1</Highlight> note
      </>
    );
  } else {
    text = (
      <>
        <Highlight>{numOfSelectedItems}</Highlight> notes
      </>
    );
  }

  return (
    <TextWrapper style={{ opacity: numOfSelectedItems === 0 ? 0.5 : 1 }}>
      {text}
    </TextWrapper>
  );
};

const SelectionInfo = ({
  numOfSelectedItems,
  deselectAll,
  swapSelectedNotes,
}) => {
  return (
    <Wrapper>
      <Heading size={3}>Selection</Heading>
      <Spacer size={UNIT * 1.5} />
      <NotesText numOfSelectedItems={numOfSelectedItems} />
      {numOfSelectedItems > 0 && (
        <>
          <Spacer size={UNIT * 2} />
          <Row>
            <Spacer size={1} />
            <IconButton
              rotation={45}
              icon={maximize2}
              onClick={() => swapSelectedNotes('horizontal')}
            />
            <IconButton
              rotation={-45}
              icon={maximize2}
              onClick={() => swapSelectedNotes('vertical')}
            />
          </Row>
          <Spacer size={UNIT * 2} />
          <MiniButton onClick={() => deselectAll(NOTES_VIEW)}>
            Deselect
          </MiniButton>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
`;

const TextWrapper = styled.div``;

const Highlight = styled.span`
  color: ${COLORS.yellow[500]};
`;

const mapStateToProps = state => ({
  numOfSelectedItems: getNumOfSelectedNotes(state),
});

const mapDispatchToProps = {
  deselectAll: actions.deselectAll,
  swapSelectedNotes: actions.swapSelectedNotes,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionInfo);
