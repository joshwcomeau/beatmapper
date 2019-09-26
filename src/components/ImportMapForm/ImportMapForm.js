import React from 'react';
import styled from 'styled-components';

import { COLORS, UNIT } from '../../constants';

import ImportMap from '../ImportMap';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import Spacer from '../Spacer';
import List from '../List';

const ImportMapForm = ({ onImport, onCancel }) => {
  return (
    <Wrapper>
      <Heading size={1}>Import existing map</Heading>
      <Spacer size={UNIT * 6} />
      <Paragraph style={{ fontSize: 18, fontWeight: 400 }}>
        To import a map, the following conditions must be met:
      </Paragraph>
      <Spacer size={UNIT * 3} />
      <List>
        <List.ListItem>
          You have a song in OGG format (.ogg or .egg)
        </List.ListItem>
        <List.ListItem>You have a cover-art image in JPEG format</List.ListItem>
        <List.ListItem>
          You have the info file (either .json or .dat), and all relevant
          difficulty files
        </List.ListItem>
        <List.ListItem>
          You've zipped them all up, without an enclosing folder (select all
          files and archive them directly)
        </List.ListItem>
      </List>
      <Spacer size={UNIT * 5} />
      <BottomParagraph>
        Drag and drop (or click to select) the .zip file:
      </BottomParagraph>{' '}
      <Spacer size={UNIT * 3} />
      <ImportMap onImport={onImport} onCancel={onCancel} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
`;

const BottomParagraph = styled.p`
  font-size: 18px;
  font-weight: 300;
  color: ${COLORS.blueGray[300]};
  text-align: center;
`;

export default ImportMapForm;
