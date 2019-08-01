import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import useLocallyStoredFile from '../../hooks/use-locally-stored-file.hook';

import CenteredSpinner from '../CenteredSpinner';

const CoverArtImage = ({ filename, size }) => {
  const [coverArtUrl, coverArtUrlLoading] = useLocallyStoredFile(filename);
  const width = size;
  const height = size;

  return coverArtUrlLoading ? (
    <LoadingArtWrapper style={{ width, height }}>
      <CenteredSpinner />
    </LoadingArtWrapper>
  ) : (
    <CoverArt src={coverArtUrl} style={{ width, height }} />
  );
};

const CoverArt = styled.img`
  object-fit: cover;
  border-radius: 4px;
`;

const LoadingArtWrapper = styled.div`
  border-radius: 4px;
  background: ${COLORS.gray[500]};
  opacity: 0.25;
`;

export default CoverArtImage;
