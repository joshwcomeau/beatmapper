import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { UNIT } from '../../constants';
import { getSeenPrompts } from '../../reducers/user.reducer';

import Heading from '../Heading';
import Modal from '../Modal';
import Spacer from '../Spacer';
import Paragraph from '../Paragraph';
import Link from '../Link';

const PROMPTS = [
  {
    id: 'alpha-warning',
    title: 'Warning: Alpha Software',
    contents: () => (
      <>
        <Paragraph>
          <span role="img" aria-label="wave">
            👋
          </span>{' '}
          Hi there, new user!
        </Paragraph>

        <Paragraph>
          Just a heads-up: Beatmapper is still under development. It's in
          pre-release / alpha. Many core features are missing, and things may
          break at any time. <strong>Download your work frequently!</strong>
        </Paragraph>

        <Paragraph>
          This editor makes heavy use of <strong>keyboard shortcuts</strong>.
          <br />
          Please{' '}
          <strong>
            <Link to="https://beatmapper.app/docs/docs/manual.html">
              read the docs
            </Link>
          </strong>{' '}
          to get up to speed quickly.
        </Paragraph>

        <Paragraph>
          Finally, some important context: This is a passion project by 1
          developer, not a commercial project. It is offered{' '}
          <span role="img" aria-label="rainbow">
            🌈
          </span>{' '}
          for free{' '}
          <span role="img" aria-label="sparkles">
            ✨
          </span>
          . Please set your expectations accordingly.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'new-docs',
    title: 'Brand new documentation!',
    contents: () => (
      <>
        <Paragraph>
          Exciting news! We just launched{' '}
          <strong>brand new, in-depth documentation.</strong>
        </Paragraph>

        <Paragraph>
          You can check it out at <Link to="/docs">beatmapper.app/docs</Link>.
          In particular, you might want to check out the{' '}
          <Link to="/docs/keyboard-shortcuts">Keyboard Shortcuts</Link> page,
          which lists all of the super-convenient shortcuts in 1 place.
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
    <Modal
      isVisible={true}
      width={500}
      onDismiss={() => dismissPrompt(prompt.id)}
      clickBackdropToDismiss={false}
    >
      <ModalContents>
        <Heading size={1}>{prompt.title}</Heading>
        <Spacer size={UNIT * 5} />
        {prompt.contents()}
      </ModalContents>
    </Modal>
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
