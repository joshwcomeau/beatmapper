import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

const SPILLOVER = 10;

const BookmarkFlag = ({ bookmark, offsetPercentage, handleClick }) => {
  // We want to return two sibling pieces:
  // - A thin vertical line that shows where the flag lives in the beat, which
  //   ignores pointer events so that the waveform remains scrubbable
  // - The flag above the waveform, which displays the beatNum/name, and is
  //   clickable to jump the user to that moment in time.

  const sharedStyles = {
    left: offsetPercentage + '%',
    color: bookmark.color.text,
    backgroundColor: bookmark.color.background,
  };

  return (
    <>
      <ThinStrip style={sharedStyles} />
      <Flag style={sharedStyles}>
        <BeatNum>{bookmark.beatNum} </BeatNum>
      </Flag>
    </>
  );
};

const ThinStrip = styled.div`
  position: absolute;
  z-index: 2;
  top: ${-SPILLOVER}px;
  bottom: ${UNIT * 2 - SPILLOVER};
  width: 1px;
  height: 100%;
  /*
    Important: no pointer events, since this line overlaps the waveform.
    I don't want to block scrubbing
  */
  pointer-events: none;
`;

const Flag = styled.div`
  position: absolute;
  z-index: 2;
  top: ${-SPILLOVER}px;
  padding: 4px;
`;

const BeatNum = styled.div`
  font-size: 13px;
  font-weight: bold;
`;

export default BookmarkFlag;
