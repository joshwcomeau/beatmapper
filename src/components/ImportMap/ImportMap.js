import React from 'react';
import { connect } from 'react-redux';
import { download as fileIcon } from 'react-icons-kit/feather/download';

import * as actions from '../../actions';
import { getAllSongs } from '../../reducers/songs.reducer';
import { processImportedMap } from '../../services/packaging.service';

import FileUploader from '../FileUploader';

const ImportMap = ({
  onImport,
  height,
  songs,
  startImportingSong,
  importExistingSong,
}) => {
  const songIds = songs.map(song => song.id);

  const handleSelectExistingMap = async file => {
    startImportingSong();
    try {
      const songData = await processImportedMap(file, songIds);

      importExistingSong(songData);
      onImport();
    } catch (err) {
      console.error('Could not import map:', err);
    }
  };

  return (
    <FileUploader
      onSelectFile={handleSelectExistingMap}
      icon={fileIcon}
      height={height}
      title="Import existing map"
      description="Select a .zip file"
    />
  );
};

const mapStateToProps = state => {
  return {
    songs: getAllSongs(state),
  };
};
const mapDispatchToProps = {
  startImportingSong: actions.startImportingSong,
  importExistingSong: actions.importExistingSong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportMap);
