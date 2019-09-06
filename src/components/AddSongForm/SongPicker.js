import React from 'react';
import styled from 'styled-components';
import { volume2 } from 'react-icons-kit/feather/volume2';

import { UNIT } from '../../constants';
import { getWaveformDataForFile } from '../../helpers/audio.helpers';

import ScrubbableWaveform from '../ScrubbableWaveform';
import FileUploader from '../FileUploader';
import Spinner from '../Spinner';

const SongPicker = ({ height, songFile, setSongFile }) => {
  const [waveformData, setWaveformData] = React.useState(null);
  const [loadingWaveformData, setLoadingWaveformData] = React.useState(null);

  React.useEffect(() => {
    if (!songFile) {
      setWaveformData(null);
      return;
    }

    setLoadingWaveformData(true);

    getWaveformDataForFile(songFile).then(waveformData => {
      setWaveformData(waveformData);
      setLoadingWaveformData(false);
    });
  }, [songFile]);

  return (
    <FileUploader
      showFilename
      file={songFile}
      icon={volume2}
      title="Song File"
      description="Browse for an .ogg song"
      height={height}
      onSelectFile={file => {
        // Couple things make this weird:
        // - Firefox treats all ogg files as video/ogg instead of audio/ogg
        // - Sometimes, file extensions are changed to .egg, for reasons I don't
        //   fully understand.
        const isValid =
          file.type === 'audio/ogg' ||
          file.type === 'video/ogg' ||
          file.name.match(/\.egg$/);

        if (!isValid) {
          // Rather than use the `accept` field to disallow selecting
          // non-OGG files, I should allow the user to select any file,
          // and then explain why only OGG files are allowed if they
          // select a different type.
          //
          // TODO: Proper toast notifications!
          alert(
            'Unfortunately, Beat Saber only supports playing .ogg ' +
              'audio files. You can convert other audio formats to ' +
              '.ogg using Audacity, or similar audio-editing programs.'
          );
          return false;
        }

        setSongFile(file);
        return true;
      }}
      onClear={() => {
        setSongFile(null);
      }}
      renderWhenFileSelected={() => {
        if (!loadingWaveformData && !waveformData) {
          return;
        }

        return (
          <MediaWrapper>
            {loadingWaveformData ? (
              <Spinner />
            ) : (
              // HACK: I'm reusing the same 'scrubbableWaveform' from
              // the editor. A better solution would be to extract a
              // shared "Waveform" base component, and build 2 variants
              // on top of it.
              //
              // TODO: Would be cool if this actually was scrubbable,
              // and playable!
              <ScrubbableWaveform
                width={500}
                height={height - UNIT * 2}
                waveformData={waveformData}
                duration={waveformData.duration}
                cursorPosition={waveformData.duration}
                scrubWaveform={() => {} /* noop */}
              />
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

export default SongPicker;
