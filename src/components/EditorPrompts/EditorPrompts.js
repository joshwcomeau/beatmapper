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
    id: 'alpha-warning',
    title: 'Welcome!',
    contents: () => (
      <>
        <Paragraph>
          Hi there, new user! Two important things to know before you get
          started:
        </Paragraph>

        <List>
          <List.ListItem>
            Beatmapper is <em>alpha software</em>. That means stuff might break
            at any moment. <strong>Download your work frequently</strong> using{' '}
            <InlineIcons>
              <KeyIcon type="slightly-wide" size="small">
                <MetaKey />
              </KeyIcon>
              <KeyIcon size="small">S</KeyIcon>
            </InlineIcons>
          </List.ListItem>

          <List.ListItem>
            We have really thorough docs! Please{' '}
            <strong>
              <Link to="https://beatmapper.app/docs/docs/manual.html">
                check them out
              </Link>
            </strong>
            , there's lots of good info in there.
          </List.ListItem>
        </List>

        <Paragraph>
          <span role="img" aria-label="rainbow">
            🌈
          </span>{' '}
          Have fun!{' '}
          <span role="img" aria-label="sparkles">
            ✨
          </span>
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

const mapStateToProps = state => {
  const seenPrompts = getSeenPrompts(state);
  const unseenPrompts = PROMPTS.filter(
    prompt => !seenPrompts.includes(prompt.id)
  );

  return {
    prompt: unseenPrompts[0],
  };
};

const mapDispatchToProps = { dismissPrompt: actions.dismissPrompt };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorPrompts);
