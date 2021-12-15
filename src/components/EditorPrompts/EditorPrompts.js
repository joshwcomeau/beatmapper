import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';
import { getSeenPrompts } from '../../reducers/user.reducer';

import UnobtrusivePrompt from '../UnobtrusivePrompt';
import Paragraph from '../Paragraph';

const PROMPTS = [
  {
    id: 'bsmg',
    title: 'Beatmapper lives on!',
    contents: () => (
      <>
        <Paragraph>
          Good news, everyone — The kind folks at the Beat Saber Modding Group
          have agreed to{' '}
          <ExternalLink href="https://github.com/bsmg/beatmapper">
            maintain this project
          </ExternalLink>
          . Beatmapper will remain online!
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

const ExternalLink = styled.a`
  color: inherit;
`;

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
