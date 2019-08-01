import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { helpCircle } from 'react-icons-kit/feather/helpCircle';
import { plus } from 'react-icons-kit/feather/plus';

import { UNIT, COLORS } from '../../constants';
import { getMetaKeyLabel } from '../../utils';

import UnstyledButton from '../UnstyledButton';
import Modal from '../Modal';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import Link from '../Link';
import Spacer from '../Spacer';
import Mouse from '../Mouse';
import BlockIcon from '../ItemGrid/BlockIcon';

import KeyIcon from './KeyIcon';

const HelpButton = ({ view }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>
        <Icon icon={helpCircle} size={32} />
      </Button>

      <Modal
        isVisible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
      >
        <ContentsWrapper>
          <Heading size={2}>General Help</Heading>
          <Spacer size={UNIT * 2} />
          <Paragraph>
            BeatMapper is in <em>alpha</em>, which means you're bound to run
            into some issues. You can let me know what you run into by{' '}
            <Link
              as="a"
              href="https://github.com/joshwcomeau/beat-mapper/issues/new"
              target="_blank"
            >
              filing an issue
            </Link>{' '}
            on Github, or{' '}
            <Link as="a" href="mailto: joshwcomeau@gmail.com">
              emailing me
            </Link>{' '}
            if you're not familiar with GH.
          </Paragraph>
          <Spacer size={UNIT * 6} />

          <Heading size={2}>Controls & Shortcuts</Heading>
          <Spacer size={UNIT * 2} />

          <DoubleRow style={{ display: 'flex' }}>
            <Row>
              <ShortcutCell>
                <Mouse activeButton="left" />
              </ShortcutCell>
              <DescriptionCell>
                Place blocks, mines, and obstacles
                <Sidenote>
                  Select which item you want to place from the sidebar
                </Sidenote>
              </DescriptionCell>
            </Row>
            <Spacer size={UNIT} />
            <Row>
              <ShortcutCell>
                <Mouse activeButton="right" />
              </ShortcutCell>
              <DescriptionCell>
                Erase blocks, mines, and obstacles
                <Sidenote>
                  You can erase multiple items by clicking and dragging
                </Sidenote>
              </DescriptionCell>
            </Row>
          </DoubleRow>

          <Row>
            <ShortcutCell>
              <Icons>
                <KeyIcon>w</KeyIcon>
              </Icons>
              <Icons>
                <KeyIcon>a</KeyIcon>
                <KeyIcon>s</KeyIcon>
                <KeyIcon>d</KeyIcon>
              </Icons>
            </ShortcutCell>
            <DescriptionCell>
              Set the direction for note blocks.
              <Sidenote>
                Diagonals can be achieved by holding multiple keys (eg.{' '}
                <InlineIcons>
                  <KeyIcon size="small">W</KeyIcon>
                  <KeyIcon size="small">A</KeyIcon>
                </InlineIcons>{' '}
                for up-left).
                <br />
                For face blocks, you can press{' '}
                <InlineIcons>
                  <KeyIcon size="small">F</KeyIcon>
                </InlineIcons>
                .
              </Sidenote>
            </DescriptionCell>
          </Row>
          <Row>
            <ShortcutCell>
              <Icons>
                <KeyIcon>Shift</KeyIcon>
                <PlusWrapper>
                  <Icon icon={plus} size={16} />
                </PlusWrapper>
                <Mouse />
              </Icons>
            </ShortcutCell>
            <DescriptionCell>
              Navigate the surroundings
              <Sidenote>
                With shift held, you can use{' '}
                <InlineIcons>
                  <KeyIcon size="small">W</KeyIcon>
                  <KeyIcon size="small">A</KeyIcon>
                  <KeyIcon size="small">S</KeyIcon>
                  <KeyIcon size="small">D</KeyIcon>
                </InlineIcons>
                to move around,{' '}
                <InlineIcons>
                  <KeyIcon size="small">R</KeyIcon>
                </InlineIcons>{' '}
                to ascend, and{' '}
                <InlineIcons>
                  <KeyIcon size="small">F</KeyIcon>
                </InlineIcons>{' '}
                to descend.
              </Sidenote>
            </DescriptionCell>
          </Row>
          <DoubleRow style={{ display: 'flex' }}>
            <Row>
              <ShortcutCell>
                <Icons>
                  <Mouse activeButton="scroll" />
                </Icons>
                <Or> or </Or>
                <Icons>
                  <KeyIcon>↓</KeyIcon>
                  <KeyIcon>↑</KeyIcon>
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Scroll through time
                <Sidenote>
                  Move forwards and backwards through the track. Control the
                  speed with "Snap to".
                </Sidenote>
              </DescriptionCell>
            </Row>
            <Spacer size={UNIT} />
            <Row>
              <ShortcutCell>
                <Icons>
                  <KeyIcon>{getMetaKeyLabel()}</KeyIcon>
                  <PlusWrapper>
                    <Icon icon={plus} size={16} />
                  </PlusWrapper>

                  <Mouse activeButton="scroll" />
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Change snapping interval
                <Sidenote>
                  Tweak the amount of time skipped on every scroll through time.
                </Sidenote>
              </DescriptionCell>
            </Row>
          </DoubleRow>

          <DoubleRow style={{ display: 'flex' }}>
            <Row>
              <ShortcutCell>
                <Icons>
                  <BlockIcon color={COLORS.red[500]} size={32} />
                  <PlusWrapper>
                    <Icon icon={plus} size={16} />
                  </PlusWrapper>
                  <Mouse activeButton="left" />
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Select block
                <Sidenote>
                  Click and drag to select multiple at once.
                  <br />
                  Click a selected note to deselect.
                </Sidenote>
              </DescriptionCell>
            </Row>
            <Spacer size={UNIT} />
            <Row>
              <ShortcutCell>
                <Icons>
                  <KeyIcon>{getMetaKeyLabel()}</KeyIcon>
                  <KeyIcon>a</KeyIcon>
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Select / Deselect all
                <Sidenote>
                  Select all notes and obstacles, or clear the current selection
                </Sidenote>
              </DescriptionCell>
            </Row>
          </DoubleRow>

          <DoubleRow style={{ display: 'flex' }}>
            <Row>
              <ShortcutCell>
                <Icons>
                  <KeyIcon>H</KeyIcon>
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Swap notes horizontally
                <Sidenote>Mirror the notes from left to right</Sidenote>
              </DescriptionCell>
            </Row>
            <Spacer size={UNIT} />
            <Row>
              <ShortcutCell>
                <Icons>
                  <KeyIcon>V</KeyIcon>
                </Icons>
              </ShortcutCell>
              <DescriptionCell>
                Swap notes vertically
                <Sidenote>Mirror the notes from top to bottom</Sidenote>
              </DescriptionCell>
            </Row>
          </DoubleRow>

          <Row>
            <ShortcutCell>
              <Icons>
                <BlockIcon color={COLORS.red[500]} size={32} />
                <PlusWrapper>
                  <Icon icon={plus} size={16} />
                </PlusWrapper>

                <Mouse activeButton="middle" />
              </Icons>
            </ShortcutCell>
            <DescriptionCell>
              Swap block color
              <Sidenote>
                Tap the middle mouse button while hovering over a block to
                toggle it from blue to red, or vice versa.
              </Sidenote>
            </DescriptionCell>
          </Row>
          <Row>
            <ShortcutCell>
              <Icons>
                <KeyIcon>j</KeyIcon>
              </Icons>
            </ShortcutCell>
            <DescriptionCell>
              Jump to a specific bar
              <Sidenote>
                You can enter fractional values for specific beats.
              </Sidenote>
            </DescriptionCell>
          </Row>
        </ContentsWrapper>
      </Modal>
    </>
  );
};

const Button = styled(UnstyledButton)`
  position: absolute;
  top: ${UNIT * 2}px;
  right: ${UNIT * 2}px;
  padding: ${UNIT * 2}px;
  color: ${COLORS.blueGray[400]};

  &:hover {
    color: ${COLORS.blueGray[300]};
  }
`;

const ContentsWrapper = styled.div`
  padding: ${UNIT * 4}px;
  max-height: 80vh;
  overflow: auto;
`;

const Icons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;

  &:last-of-type {
    margin-bottom: 0;
  }

  & > * {
    margin-right: 4px;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const InlineIcons = styled(Icons)`
  display: inline-flex;
  padding: 0 4px;
  transform: translateY(-2px);
`;

const PlusWrapper = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
`;

const DoubleRow = styled.div``;

const Row = styled.div`
  display: flex;
  padding-bottom: ${UNIT * 2}px;
  margin-bottom: ${UNIT * 2}px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  ${DoubleRow} & {
    flex: 1;
  }
`;

const Cell = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ShortcutCell = styled(Cell)`
  width: 150px;
`;

const DescriptionCell = styled(Cell)`
  flex: 1;
  font-size: 16px;
  line-height: 1.45;
`;

const Sidenote = styled.div`
  font-size: 14px;
  font-weight: 300;
  margin-top: 8px;
  line-height: 1.3;
`;

const Or = styled.div`
  text-align: center;
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 12px;

  &::before {
    content: '—';
    opacity: 0.5;
  }

  &::after {
    content: '—';
    opacity: 0.5;
  }
`;

export default HelpButton;
