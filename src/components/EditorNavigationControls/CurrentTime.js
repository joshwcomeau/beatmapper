import React from 'react';
import { connect } from 'react-redux';

import { getFormattedTimestamp } from '../../helpers/audio.helpers';
import { getCursorPosition } from '../../reducers/navigation.reducer';

import LabeledNumber from '../LabeledNumber';

const CurrentTime = ({ displayString }) => {
  return <LabeledNumber label="Time">{displayString}</LabeledNumber>;
};

const mapStateToProps = state => {
  const cursorPosition = getCursorPosition(state);

  return {
    displayString: getFormattedTimestamp(cursorPosition),
  };
};

export default connect(mapStateToProps)(CurrentTime);
