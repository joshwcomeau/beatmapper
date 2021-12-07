import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSeenPrompts } from '../../reducers/user.reducer';

import UnobtrusivePrompt from '../UnobtrusivePrompt';
import Paragraph from '../Paragraph';
import Link from '../Link';
import List from '../List';
import { InlineIcons, KeyIcon, MetaKey } from '../Docs/ShortcutHelpers';

const PROMPTS = [
  {
    id: 'deprecated',
    title: 'This editor is deprecated.',
    contents: () => (
      <>
        <Paragraph>
          Hey there — so, Beatmapper isn't really maintained anymore, and you're
          probably better off switching to another editor.
        </Paragraph>
        <Paragraph>
          Check out{' '}
          <a
            href="https://github.com/Caeden117/ChroMapper"
            style={{ color: 'inherit' }}
          >
            ChroMapper
          </a>
          . It's a free, cross-platform editor which is regularly updated. It
          supports 90/360 map creation as well!
        </Paragraph>

        <Paragraph>
          You're welcome to keep using Beatmapper, but please know that{' '}
          <strong>you're doing so at your own risk.</strong> It's possible that
          the maps you create won't work in-game, as the game updates.
        </Paragraph>
      </>
    ),
  },
];

const EditorPrompts = ({ prompt, dismissPrompt }) => {
  if (!prompt) {
    return null;
  }

  return (
    <UnobtrusivePrompt
      title={prompt.title}
      onDismiss={() => dismissPrompt(prompt.id)}
    >
      {prompt.contents()}
    </UnobtrusivePrompt>
  );
};

const mapStateToProps = (state) => {
  const seenPrompts = getSeenPrompts(state);
  const unseenPrompts = PROMPTS.filter(
    (prompt) => !seenPrompts.includes(prompt.id)
  );

  return {
    prompt: unseenPrompts[0],
  };
};

const mapDispatchToProps = { dismissPrompt: actions.dismissPrompt };

export default connect(mapStateToProps, mapDispatchToProps)(EditorPrompts);
