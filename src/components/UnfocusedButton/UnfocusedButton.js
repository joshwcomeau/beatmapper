/**
 * In this editor, I often want to unfocus buttons after click.
 *
 * For example, if the user clicks the "zoom in" button, I want to unfocus it so
 * that when they press 'space' to play the track, it doesn't trigger the button
 * again.
 *
 * NOTE: This is VERY unfriendly from an a11y perspective; in general, you want
 * to let the user manage focus of elements themselves. Please don't copy this
 * into generalized web applications; the only reason I'm doing this here is
 * because Beat Saber, the game this editor is made for, isn't very accessible,
 * and I suspect anyone capable of playing the game is likely to be using a
 * mouse to navigate. Although this assumption may be wrong, and I may revisit
 * this idea in the future.
 */
import React from 'react';

import UnstyledButton from '../UnstyledButton';

const UnfocusedButton = ({ onClick, ...delegated }) => {
  return (
    <UnstyledButton
      {...delegated}
      onClick={ev => {
        if (typeof onClick === 'function') {
          ev.currentTarget.blur();
          onClick(ev);
        }
      }}
    />
  );
};

export default UnfocusedButton;
