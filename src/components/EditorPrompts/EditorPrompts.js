import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getSeenPrompts } from '../../reducers/user.reducer';

import Heading from '../Heading';
import UnobtrusivePrompt from '../UnobtrusivePrompt';
import Spacer from '../Spacer';
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

const ModalContents = styled.div`
  padding: ${UNIT * 4}px;

  p {
    margin-bottom: ${UNIT * 3}px;
    font-size: 18px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }

  strong {
    font-weight: bold;
  }
`;

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
