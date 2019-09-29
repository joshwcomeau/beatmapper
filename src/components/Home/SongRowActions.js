import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import * as actions from '../../actions';

import MiniButton from '../MiniButton';

const SongRowActions = ({ songId, size, deleteSong, downloadMapFiles }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure? This action cannot be undone 😱')) {
      deleteSong(songId);
    }
  };

  const handleCopy = () => {
    window.alert('This feature does not exist yet. Sorry! Coming soon.');
  };

  return (
    <MiniButton as="div" style={{ height: size, width: size }}>
      <Icon icon={chevronDown} />
      <Select
        style={{ height: size, width: size }}
        value=""
        onChange={ev => {
          switch (ev.target.value) {
            case 'copy':
              return handleCopy();
            case 'delete':
              return handleDelete();
            case 'download':
              return downloadMapFiles({ songId });
            default:
              throw new Error('Unrecognized action: ' + ev.target.value);
          }
        }}
      >
        <option />
        <option value="copy">Copy</option>
        <option value="delete">Delete</option>
        <option value="download">Download</option>
      </Select>
    </MiniButton>
  );
};

const Select = styled.select`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;

  /*
    Reports of invisible text on options on Chrome Windows.
    Not sure if this is an actual fix tho.
  */
  option {
    color: black;
  }
`;

export default connect(
  null,
  { deleteSong: actions.deleteSong, downloadMapFiles: actions.downloadMapFiles }
)(SongRowActions);
