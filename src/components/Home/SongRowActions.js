import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';

import * as actions from '../../actions';

import MiniButton from '../MiniButton';

const SongRowActions = ({ songId, size, deleteSong }) => {
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
          if (ev.target.value === 'copy') {
            handleCopy();
          } else if (ev.target.value === 'delete') {
            handleDelete();
          }
        }}
      >
        <option />
        <option value="copy">Copy</option>
        <option value="delete">Delete</option>
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
`;

export default connect(
  null,
  { deleteSong: actions.deleteSong }
)(SongRowActions);
