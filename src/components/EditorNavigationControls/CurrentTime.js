import React from 'react';
import { connect } from 'react-redux';

import { getFormattedTimestamp } from '../../helpers/audio.helpers';

import LabeledNumber from '../LabeledNumber';

const CurrentTime = ({ cursorPosition }) => {
  return (
    <LabeledNumber label="Time">
      {getFormattedTimestamp(cursorPosition)}
    </LabeledNumber>
  );
};

const mapStateToProps = state => ({
  cursorPosition: state.navigation.cursorPosition,
});

export default connect(mapStateToProps)(CurrentTime);
