import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { image } from 'react-icons-kit/feather/image';

import sampleCoverArtSrc from '../../assets/images/sample-cover-art.jpg';
import { COLORS, UNIT } from '../../constants';

import Spacer from '../Spacer';

const CoverArtSelector = ({ coverArt }) => {
  const fileInputRef = React.useRef(null);

  return (
    <Wrapper>
      {coverArt ? (
        <CoverArtImage src={coverArt} />
      ) : (
        <PlaceholderWrapper>
          <InnerWrapper>
            <IconWrapper>
              <Icon icon={image} size={32} />
            </IconWrapper>
            <Spacer size={UNIT * 3} />
            <Title>Cover Art</Title>
            <Spacer size={UNIT * 2} />
            <Description>
              Browse for a square cover image, at least 500px wide
            </Description>

            <FileInput ref={fileInputRef} />
          </InnerWrapper>
        </PlaceholderWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const CoverArtImage = styled.img``;

const PlaceholderWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed ${COLORS.gray[300]};
  border-radius: 8px;
  padding: ${UNIT}px;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${UNIT * 2}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconWrapper = styled.span`
  color: ${COLORS.gray[300]};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
  color: ${COLORS.gray[100]};
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default CoverArtSelector;
