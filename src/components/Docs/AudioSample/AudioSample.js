import React from 'react';
import { Howl } from 'howler';

import { easeOutCubic } from './helpers/easing';
import { getStopIconPoints, getPlayIconPoints } from './helpers/icon-points';
import idGenerator from './helpers/id-generator';

const noop = () => {};

class PlayButton extends React.Component {
  /*
  static propTypes = {
    url:                    PropTypes.string.isRequired,
    active:                 PropTypes.bool,
    play:                   PropTypes.func,
    stop:                   PropTypes.func,
    audioId:                PropTypes.string,
    audioFormat:            PropTypes.string,
    size:                   PropTypes.number,
    progressCircleWidth:    PropTypes.number,
    progressCircleColor:    PropTypes.string,
    idleBackgroundColor:    PropTypes.string,
    activeBackgroundColor:  PropTypes.string,
    stopIconColor:          PropTypes.string,
    playIconColor:          PropTypes.string,
    iconAnimationLength:    PropTypes.number,
    fadeInLength:           PropTypes.number,
    fadeOutLength:          PropTypes.number
  }
  */
  state = {
    progress: 0,
    isPlaying: false,
  };

  static defaultProps = {
    play: noop,
    stop: noop,
    audioId: idGenerator(),
    audioFormat: 'mp3',
    size: 45,
    progressCircleWidth: 4,
    progressCircleColor: '#78A931',
    idleBackgroundColor: '#191b1d',
    activeBackgroundColor: '#191b1d',
    stopIconColor: '#FFFFFF',
    playIconColor: '#FFFFFF',
    iconAnimationLength: 450,
    fadeInLength: 0,
    fadeOutLength: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      loading: true,
      iconPoints: getPlayIconPoints(props),
    };

    this.updateProgress = this.updateProgress.bind(this);
  }

  componentWillMount() {
    this.setupHowler();
  }

  componentWillUnmount() {
    this.howler.unload();
  }

  componentWillReceiveProps(nextProps) {
    const newAudioClip = this.props.url !== nextProps.url;
    if (newAudioClip) {
      this.setupHowler();
    }
  }

  handleClick = () => {
    if (this.state.isPlaying) {
      this.triggerStopAudio();
    } else {
      this.triggerPlayAudio();
    }

    this.setState({ isPlaying: !this.state.isPlaying });
  };

  triggerPlayAudio() {
    // Tell howler to drop the beat.
    this.howler.play();
    this.howler.fade(0, 1, this.props.fadeInLength);

    // Morph our icon into a stop button
    this.animateIcon('stop');

    // Reset the progress bar, and start animating it.
    this.setState({ progress: 0 }, () => this.updateProgress());
  }

  triggerStopAudio() {
    this.howler.fade(1, 0, this.props.fadeOutLength);
    window.setTimeout(() => this.howler.stop(), this.props.fadeOutLength);

    this.animateIcon('play');

    this.setState({ progress: 0 });
  }

  setupHowler() {
    // If we have a currently-loaded howler, unload it so we can load our new sound.
    if (this.howler && this.howler.unload) this.howler.unload();

    this.howler = new Howl({
      src: [this.props.url],
      format: this.props.audioFormat,
      onend: this.props.stop,
      onload: () => {
        this.setState({
          loading: false,
          duration: this.howler.duration(this.props.audioId) * 1000,
        });
      },
    });
  }

  updateProgress() {
    window.requestAnimationFrame(() => {
      // Stop immediately if this button is no longer active
      if (!this.state.isPlaying) return;

      this.setState({
        progress: (this.howler.seek() * 1000) / this.state.duration,
      });

      this.updateProgress();
    });
  }

  animateIcon(shape) {
    const easingFunction = easeOutCubic;
    const startTime = new Date().getTime();
    const duration = this.props.iconAnimationLength;
    const initialPoints = this.state.iconPoints;
    const finalPoints =
      shape === 'stop'
        ? getStopIconPoints(this.props)
        : getPlayIconPoints(this.props);

    const updatePosition = () => {
      requestAnimationFrame(() => {
        const time = new Date().getTime() - startTime;

        // Our end condition. The time has elapsed, the animation is completed.
        if (time > duration) return;

        // Let's figure out where the new points should be.
        // There are a total of 8 numbers to work out (4 points, each with x/y).
        // easiest way is probably just to map through them.
        const newPoints = initialPoints.map((initialPoint, index) => {
          const [initialX, initialY] = initialPoint;
          const [finalX, finalY] = finalPoints[index];

          return [
            easingFunction(time, initialX, finalX - initialX, duration),
            easingFunction(time, initialY, finalY - initialY, duration),
          ];
        });

        this.setState(
          {
            iconPoints: newPoints,
          },
          updatePosition
        );
      });
    };

    updatePosition();
  }

  renderIcon() {
    const { isPlaying } = this.state;
    const { playIconColor, stopIconColor } = this.props;
    const points = this.state.iconPoints.map(p => p.join(',')).join(' ');

    return (
      <polygon
        points={points}
        style={{ cursor: 'pointer' }}
        fill={isPlaying ? playIconColor : stopIconColor}
      />
    );
  }

  renderMainCircle() {
    const { size, idleBackgroundColor, activeBackgroundColor } = this.props;

    const radius = size / 2;

    return (
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        style={{ cursor: 'pointer' }}
        fill={
          this.state.isPlaying ? activeBackgroundColor : idleBackgroundColor
        }
      />
    );
  }

  renderProgressBar() {
    const { size, progressCircleWidth, progressCircleColor } = this.props;

    const center = size / 2;
    const diameter = size - progressCircleWidth;
    const radius = diameter / 2;
    const circumference = diameter * Math.PI;
    const progressWidth = Math.floor(
      1 - (1 - this.state.progress) * circumference
    );

    const circlePath = `
      M ${center}, ${center}
      m 0, -${radius}
      a ${radius},${radius} 0 1,0 0,${diameter}
      a ${radius},${radius} 0 1,0 0,-${diameter}
    `;

    return (
      <path
        d={circlePath}
        stroke={progressCircleColor}
        strokeWidth={progressCircleWidth}
        strokeDasharray={circumference}
        style={{
          cursor: 'pointer',
          strokeDashoffset: progressWidth,
        }}
        fill="transparent"
      />
    );
  }

  render() {
    const { size } = this.props;

    return (
      <svg
        width={size}
        height={size}
        onClick={this.handleClick}
        style={{ marginBottom: 25 }}
      >
        {this.renderMainCircle()}
        {this.state.isPlaying ? this.renderProgressBar() : null}
        {this.renderIcon()}
      </svg>
    );
  }
}

export default PlayButton;
