import React from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { x } from 'react-icons-kit/feather/x';
import { useDropzone } from 'react-dropzone';

import { COLORS, UNIT } from '../../constants';

import Spacer from '../Spacer';
import UnstyledButton from '../UnstyledButton';

const FileUploader = ({
  icon,
  file,
  title,
  description,
  height,
  onSelectFile,
  onClear,
  showFilename,
  renderWhenFileSelected,
  ...delegated
}) => {
  const onDrop = React.useCallback(
    acceptedFiles => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        onSelectFile(selectedFile);
      }
    },
    [onSelectFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClear = () => {
    onClear();
  };

  const rootProps = getRootProps();

  return (
    <Wrapper
      {...rootProps}
      style={{
        ...(rootProps.style || {}),
        height,
      }}
    >
      {file ? (
        <SelectedWrapper>
          {renderWhenFileSelected()}

          <SelectedHeader>
            <Filename>{showFilename && file.name}</Filename>
            <Spacer size={UNIT * 4} />
            <ClearAction onClick={handleClear}>
              <Icon icon={x} size={16} />
              <Spacer size={UNIT} />
              Clear
            </ClearAction>
          </SelectedHeader>
          <SelectedHeaderGradient />
        </SelectedWrapper>
      ) : (
        <PlaceholderWrapper
          style={{
            borderColor: isDragActive
              ? COLORS.yellow[500]
              : COLORS.blueGray[300],
          }}
        >
          <InnerWrapper>
            <IconWrapper>
              <Icon icon={icon} size={24} />
            </IconWrapper>
            <Spacer size={UNIT * 2} />
            <Title>{title}</Title>
            <Spacer size={UNIT * 1} />
            <Description>{description}</Description>

            <FileInput {...delegated} {...getInputProps()} />
          </InnerWrapper>
        </PlaceholderWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectedWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid ${COLORS.gray[500]};
  border-radius: 8px;
  padding: ${UNIT}px;
`;

const SelectedHeader = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 0 ${UNIT * 3}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${COLORS.gray[100]};
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 500ms;

  ${Wrapper}:hover & {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 200ms;
  }
`;

const SelectedHeaderGradient = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  border-radius: 8px 8px 0 0;
  background: linear-gradient(
    to bottom,
    hsl(0, 0%, 7%) 0%,
    hsla(0, 0%, 7%, 0.987) 8.1%,
    hsla(0, 0%, 7%, 0.951) 15.5%,
    hsla(0, 0%, 7%, 0.896) 22.5%,
    hsla(0, 0%, 7%, 0.825) 29%,
    hsla(0, 0%, 7%, 0.741) 35.3%,
    hsla(0, 0%, 7%, 0.648) 41.2%,
    hsla(0, 0%, 7%, 0.55) 47.1%,
    hsla(0, 0%, 7%, 0.45) 52.9%,
    hsla(0, 0%, 7%, 0.352) 58.8%,
    hsla(0, 0%, 7%, 0.259) 64.7%,
    hsla(0, 0%, 7%, 0.175) 71%,
    hsla(0, 0%, 7%, 0.104) 77.5%,
    hsla(0, 0%, 7%, 0.049) 84.5%,
    hsla(0, 0%, 7%, 0.013) 91.9%,
    hsla(0, 0%, 7%, 0) 100%
  );
  opacity: 0;
  transition: opacity 1000ms;

  ${Wrapper}:hover & {
    opacity: 0.75;
    transition: opacity 300ms;
  }
`;

const Filename = styled.div`
  height: 100%;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const ClearAction = styled(UnstyledButton)`
  display: flex;
  align-items: center;
`;

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
  justify-content: flex-start;
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
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export default FileUploader;
