import React from 'react';
import styled from 'styled-components';

import { UNIT } from '../../constants';

import UnstyledButton from '../UnstyledButton';

const TOP_SPILLOVER = 15;
const BOTTOM_SPILLOVER = UNIT;

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
      <Flag style={sharedStyles} onClick={handleClick}>
        <BeatNum>{bookmark.beatNum} </BeatNum>
        <Name>{bookmark.name}</Name>
        <FlagDecoration viewBox="0 0 5 10">
          <polygon fill={bookmark.color.background} points="0,0 5,5 0,10" />
        </FlagDecoration>
      </Flag>
    </>
  );
};

const ThinStrip = styled.div`
  position: absolute;
  z-index: 2;
  top: ${-TOP_SPILLOVER}px;
  bottom: ${-BOTTOM_SPILLOVER}px;
  width: 2px;
  transform: translateX(-1px);
  border-radius: 2px 0 2px 2px;
  /*
    Important: no pointer events, since this line overlaps the waveform.
    I don't want to block scrubbing
  */
  pointer-events: none;
`;

const Flag = styled(UnstyledButton)`
  position: absolute;
  z-index: 2;
  top: ${-TOP_SPILLOVER}px;
  padding-left: 4px;
  padding-right: 4px;
  height: 20px;
  line-height: 20px;
  display: flex;
`;

const BeatNum = styled.div`
  font-size: 11px;
  font-weight: bold;
`;

const FlagDecoration = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  transform: translateX(100%);
  height: 100%;
`;

const Name = styled.div`
  margin-left: 6px;
  font-size: 11px;
  display: none;

  ${Flag}:hover & {
    display: block;
  }
`;

export default BookmarkFlag;
