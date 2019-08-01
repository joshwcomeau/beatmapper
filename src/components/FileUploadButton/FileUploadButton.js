import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

const FileUploadButton = ({ file, onSelectFile, ...delegated }) => {
  const fileInputRef = React.useRef(null);

  const handleChange = () => {
    if (!fileInputRef.current) {
      return;
    }

    const selectedFile = fileInputRef.current.files[0];

    if (selectedFile) {
      onSelectFile(selectedFile);
    }
  };

  return (
    <Wrapper>
      <Button {...delegated} />
      <FileInput type="file" ref={fileInputRef} onChange={handleChange} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export default FileUploadButton;
