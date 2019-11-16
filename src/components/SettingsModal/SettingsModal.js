import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { getProcessingDelay } from '../../reducers/user.reducer';
import { UNIT } from '../../constants';

import Modal from '../Modal';
import Heading from '../Heading';
import Spacer from '../Spacer';
import TextInput from '../TextInput';
import QuestionTooltip from '../QuestionTooltip';

const SettingsModal = ({
  isVisible,
  onDismiss,

  processingDelay,
  updateProcessingDelay,
}) => {
  return (
    <Modal width={400} isVisible={isVisible} onDismiss={onDismiss}>
      <Wrapper>
        <Heading size={1}>App settings</Heading>
        <Spacer size={UNIT * 6} />

        <TextInput
          label={
            <span>
              Processing delay{' '}
              <QuestionTooltip animateFill={false}>
                Tweak the amount of time, in milliseconds, that the audio should
                be offset by, for it to seem synchronized.
                <br />
                <br />
                Slower machines should experiment with larger numbers.
              </QuestionTooltip>
            </span>
          }
          value={processingDelay}
          onChange={ev => updateProcessingDelay(Number(ev.target.value))}
        />
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
`;

const mapStateToProps = state => {
  return {
    processingDelay: getProcessingDelay(state),
  };
};

const mapDispatchToProps = {
  updateProcessingDelay: actions.updateProcessingDelay,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
