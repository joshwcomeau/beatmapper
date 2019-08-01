import React from 'react';
import styled from 'styled-components';
import { image as imageIcon } from 'react-icons-kit/feather/image';

import FileUploader from '../FileUploader';
import Spinner from '../Spinner';

const CoverArtPicker = ({ height, coverArtFile, setCoverArtFile }) => {
  // HACK: After selecting a file, for a brief moment (a couple frames), the
  // "broken image" border is shown. My useEffect hook SHOULD fire the moment
  // a file is selected, so I'm not sure why it's so problematic... but if I
  // treat it as "always loading when an image isn't visible", the problem
  // goes away.
  const [loadingCoverArtImage, setLoadingCoverArtImage] = React.useState(true);
  const [coverArtPreview, setCoverArtPreview] = React.useState(null);

  React.useEffect(() => {
    if (!coverArtFile) {
      setCoverArtPreview(null);
      setLoadingCoverArtImage(true);
      return;
    }

    setLoadingCoverArtImage(true);

    const fileReader = new FileReader();

    fileReader.onload = function(e) {
      setCoverArtPreview(this.result);
      setLoadingCoverArtImage(false);
    };

    fileReader.readAsDataURL(coverArtFile);
  }, [coverArtFile, setCoverArtFile, setCoverArtPreview]);

  return (
    <FileUploader
      icon={imageIcon}
      file={coverArtFile}
      title="Cover Art"
      description="Select a square cover image"
      height={height}
      onSelectFile={setCoverArtFile}
      onClear={() => setCoverArtFile(null)}
      renderWhenFileSelected={() => {
        return (
          <MediaWrapper>
            {loadingCoverArtImage ? (
              <Spinner />
            ) : (
              <CoverArtPreview src={coverArtPreview} />
            )}
          </MediaWrapper>
        );
      }}
    />
  );
};

const MediaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const CoverArtPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

export default CoverArtPicker;
