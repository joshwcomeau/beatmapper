import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { getSeenPrompts } from '../../reducers/user.reducer';

import UnobtrusivePrompt from '../UnobtrusivePrompt';
import Paragraph from '../Paragraph';

const PROMPTS = [
  {
    id: 'deprecated',
    title: 'Beatmapper is shutting down',
    contents: () => (
      <>
        <Paragraph>
          Hey there — Just a heads-up, Beatmapper will be shutting down in the
          weeks ahead. I don't have the time to maintain it, unfortunately.
        </Paragraph>
        <Paragraph>
            Check out{' '}
          <a
            href="https://github.com/Caeden117/ChroMapper"
            style={{ color: 'inherit' }}
          >
            ChroMapper
          </a>
          . It's a free, cross-platform community editor. It has tons of great
          features, like 90/360 map support!
        </Paragraph>

        <Paragraph>
          <strong>Please download all of your maps now,</strong> to make sure
          you don't lose any work!
        </Paragraph>
        <Paragraph>
          {/* eslint-ignore-next-line */}
          It's been a ton of fun creating this editor, thanks for checking it
          out. 🙂
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
