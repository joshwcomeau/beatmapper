import React from 'react';
import styled from 'styled-components';

import { throttle } from '../../utils';
import {
  getDevicePixelRatio,
  getScaledCanvasProps,
} from '../../helpers/canvas.helpers';

const getY = (totalHeight, val) => {
  const amplitude = 256;
  return totalHeight - ((val + 128) * totalHeight) / amplitude;
};

const getNewCursorPosition = (ev, ref, duration) => {
  const boundingBox = ref.current.getBoundingClientRect();

  // Our waveform will be N pixels from both sides of the screen.
  const xDistanceIntoCanvas = ev.pageX - boundingBox.left;
  const ratio = xDistanceIntoCanvas / boundingBox.width;

  return ratio * duration;
};

export const ScrubbableWaveform = ({
  width,
  height,
  waveformData,
  duration,
  cursorPosition,
  isEnabled,
  scrubWaveform,
}) => {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  const { style, ...dimensions } = getScaledCanvasProps(width, height);

  const [scrubbing, setScrubbing] = React.useState(false);

  const handleClick = React.useCallback(
    ev => {
      if (!canvasRef.current) {
        return;
      }

      const newCursorPosition = getNewCursorPosition(ev, canvasRef, duration);

      scrubWaveform(newCursorPosition);
    },
    [duration, scrubWaveform]
  );

  const throttledHandler = React.useCallback(
    throttle(ev => {
      if (!scrubbing) {
        return;
      }

      const newCursorPosition = getNewCursorPosition(ev, canvasRef, duration);

      scrubWaveform(newCursorPosition);
    }, 30),
    [duration, scrubWaveform, scrubbing]
  );

  const handleMouseMove = ev => {
    ev.persist();
    throttledHandler(ev);
  };

  const handleMouseDown = ev => {
    setScrubbing(true);

    window.addEventListener('mouseup', () => {
      setScrubbing(false);
    });
  };

  React.useEffect(() => {
    if (!canvasRef.current || !waveformData) {
      return;
    }

    if (!contextRef.current) {
      contextRef.current = canvasRef.current.getContext('2d');
    }

    const ctx = contextRef.current;

    const devicePixelRatio = getDevicePixelRatio();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#FFF';

    ctx.beginPath();

    const resampledData = waveformData.resample({ width });

    resampledData.min.forEach((min, i) => {
      ctx.lineTo(i, getY(height, min));
      ctx.lineTo(i + 0.5, getY(height, resampledData.max[i]));
    });

    ctx.stroke();
  }, [width, height, waveformData]);

  const ratioPlayed = cursorPosition / duration;

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={style}
        {...dimensions}
      />
      <ProgressRect style={{ transform: `scaleX(${1 - ratioPlayed})` }} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Canvas = styled.canvas`
  position: relative;
  z-index: 1;
  display: block;
`;

const ProgressRect = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  mix-blend-mode: darken;
  transform-origin: center right;
  pointer-events: none;
`;

export default React.memo(ScrubbableWaveform);
