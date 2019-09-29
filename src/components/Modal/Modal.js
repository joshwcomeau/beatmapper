// @flow
/**
 * TODO: Accessibility. There are a lot of a11y things for modals, and this
 * component isn't doing any of them :/
 *
 * TODO: Use a portal to render this at the top-level, to avoid any z-index
 * issues?
 */
import React, { PureComponent } from 'react';
import { Spring } from 'react-spring/renderprops';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';
import Icon from 'react-icons-kit';
import { x } from 'react-icons-kit/feather/x';

import { COLORS } from '../../constants';
import { hasPropChanged } from '../../utils';

import ScrollDisabler from '../ScrollDisabler';
import UnstyledButton from '../UnstyledButton';

class Modal extends PureComponent {
  static defaultProps = {
    width: 750,
    alignment: 'center', // top | center
    clickBackdropToDismiss: true,
  };

  state = {
    outdatedChildren: null,
    showBackdropX: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillReceiveProps(nextProps) {
    // When the modal is dismissed, we want to render the "stale" children for
    // a couple hundred milliseconds, until the modal has fully closed.
    // This is to prevent the underlying component from changing as it fades
    // away.
    if (hasPropChanged(this.props, nextProps, 'isVisible')) {
      if (nextProps.isVisible) {
        this.setState({ outdatedChildren: null });
      } else {
        this.setState({ outdatedChildren: this.props.children });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = ev => {
    if (ev.code !== 'Escape') {
      return;
    }

    ev.stopPropagation();

    this.props.onDismiss();
  };

  render() {
    const {
      isVisible,
      width,
      height,
      alignment,
      onDismiss,
      clickBackdropToDismiss,
      children,
    } = this.props;
    const { outdatedChildren, showBackdropX } = this.state;

    return (
      <>
        {isVisible && <ScrollDisabler />}

        <Transition in={isVisible} timeout={300}>
          {transitionState => {
            if (transitionState === 'exited') {
              return null;
            }

            const inTransit =
              transitionState === 'entering' || transitionState === 'exiting';

            const translateY = transitionState === 'entered' ? 0 : 50;
            return (
              <Spring
                to={{
                  translateY,
                  opacity: inTransit ? 0 : 1,
                }}
              >
                {interpolated => (
                  <Wrapper
                    opacity={interpolated.opacity}
                    clickable={!inTransit}
                    alignment={alignment}
                  >
                    <Backdrop
                      onClick={clickBackdropToDismiss ? onDismiss : undefined}
                    />

                    <PaneWrapper
                      width={width}
                      height={height}
                      alignment={alignment}
                      translateY={interpolated.translateY}
                    >
                      <div
                        onMouseLeave={() =>
                          this.setState({ showBackdropX: true })
                        }
                        onMouseEnter={() =>
                          this.setState({ showBackdropX: false })
                        }
                      >
                        {outdatedChildren || children}
                      </div>
                      {showBackdropX && (
                        <ManualDismiss onClick={onDismiss}>
                          <Icon icon={x} size={32} />
                        </ManualDismiss>
                      )}
                    </PaneWrapper>
                  </Wrapper>
                )}
              </Spring>
            );
          }}
        </Transition>
      </>
    );
  }
}

const Wrapper = styled.div.attrs(props => ({
  style: {
    opacity: props.opacity,
    pointerEvents: props.clickable ? 'auto' : 'none',
    alignItems: props.alignment === 'center' ? 'center' : 'flex-start',
  },
}))`
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: opacity;
  /*
    If items are too large to fit in the modal, we want them to be
    scrollable.
  */
  overflow: auto;
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
`;

const PaneWrapper = styled.div.attrs(props => ({
  style: {
    width: props.width,
    height: props.height,
    transform: `translateY(${props.translateY}px)`,
    top: props.alignment === 'top' && '20%',
  },
}))`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 95%;
  border-radius: 16px;
  background: ${COLORS.blueGray[900]};
  will-change: transform;
`;

const ManualDismiss = styled(UnstyledButton)`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.75;
  transform: translateY(-150%);

  &:hover {
    opacity: 1;
  }
`;

export default Modal;
