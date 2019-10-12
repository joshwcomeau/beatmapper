import React from 'react';
import styled from 'styled-components';
import { Canvas } from 'react-three-fiber';
import { useSpring, animated as a } from 'react-spring/three';
import { Link } from 'react-router-dom';

import { UNIT } from '../../constants';

import Spacer from '../Spacer';
import Block from '../Block';

const noop = () => {};

const Logo = ({ size = 'full', color = '#FFF' }) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const spring = useSpring({
    rotation: [0, isHovering ? 0 : -0.35, 0],
    config: { tension: 200, friction: 50 },
  });

  return (
    <Wrapper
      to="/"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Canvas
        pixelRatio={window.devicePixelRatio || 1}
        style={{
          width: size === 'full' ? 50 : 30,
          height: size === 'full' ? 50 : 30,
        }}
      >
        <a.group rotation={spring.rotation}>
          <Block
            x={0}
            y={0}
            z={2}
            direction={1}
            size={3}
            handleClick={noop}
            handleStartSelecting={noop}
            handleMouseOver={noop}
          />
        </a.group>

        <ambientLight intensity={0.85} />
        <spotLight
          intensity={0.5}
          position={[0, 30, 8]}
          angle={0.5}
          penumbra={1}
        />
        <spotLight
          intensity={0.1}
          position={[5, 0, 20]}
          angle={0.75}
          penumbra={0.2}
        />
        <spotLight
          intensity={0.1}
          position={[-20, -10, 4]}
          angle={1}
          penumbra={1}
        />
      </Canvas>
      <Spacer size={UNIT} />
      <Text style={{ fontSize: size === 'full' ? 24 : 18, color }}>
        Beatmapper
      </Text>
    </Wrapper>
  );
};

const Wrapper = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Text = styled.div`
  font-size: 24px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
`;

export default Logo;
