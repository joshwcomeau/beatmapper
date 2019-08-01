import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';

import { UNIT, COLORS, DIFFICULTIES, DIFFICULTY_COLORS } from '../../constants';

import CoverArtImage from '../CoverArtImage';
import Spacer from '../Spacer';
import MiniButton from '../MiniButton';
import UnstyledButton from '../UnstyledButton';

import SongRowActions from './SongRowActions';

const SQUARE_SIZE = 12;
const SQUARE_PADDING = 4;
const CELL_HEIGHT = 40;

const SongsTableRow = ({ song, location }) => {
  // TODO: Support auto-loading the last difficulty edited!
  const difficultyToLoad = Object.keys(song.difficultiesById)[0];

  return (
    <tr>
      <CoverArtCell>
        <CoverArtImage filename={song.coverArtFilename} size={CELL_HEIGHT} />
      </CoverArtCell>
      <DescriptionCell>
        <Title>{song.name}</Title>
        <Spacer size={6} />
        <Artist>{song.artistName}</Artist>
      </DescriptionCell>
      <DifficultySquaresCell>
        <DifficultySquaresWrapper>
          {DIFFICULTIES.map(difficulty => (
            <Tooltip key={difficulty} title={difficulty}>
              <DificultySquareWrapper>
                <DifficultySquare
                  color={DIFFICULTY_COLORS[difficulty]}
                  isOn={!!song.difficultiesById[difficulty]}
                />
              </DificultySquareWrapper>
            </Tooltip>
          ))}
        </DifficultySquaresWrapper>
      </DifficultySquaresCell>
      <ActionsCell>
        <Actions>
          <MiniButton
            style={{
              height: CELL_HEIGHT,
              paddingLeft: UNIT * 2,
              paddingRight: UNIT * 2,
            }}
            to={`/edit/${song.id}/${difficultyToLoad}/notes`}
          >
            Load Map
          </MiniButton>
          <Spacer size={UNIT} />
          <SongRowActions songId={song.id} size={CELL_HEIGHT} />
        </Actions>
      </ActionsCell>
    </tr>
  );
};

const Cell = styled.td`
  height: ${CELL_HEIGHT + UNIT * 2}px;
  padding: ${UNIT}px;
  vertical-align: top;

  &:last-of-type {
    padding-right: 0;
    text-align: right;
  }
`;

const CoverArtCell = styled(Cell)`
  width: ${CELL_HEIGHT}px;
`;

const DescriptionCell = styled(Cell)``;
const ActionsCell = styled(Cell)`
  width: 138px;
`;

const Actions = styled.div`
  display: flex;
`;

const DifficultySquaresCell = styled(Cell)`
  padding-left: ${UNIT * 2}px;
  padding-right: ${UNIT * 2}px;
  width: ${SQUARE_SIZE * 5 + SQUARE_PADDING * 8 + UNIT * 3}px;
`;

const DifficultySquaresWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${CELL_HEIGHT}px;
`;

const DificultySquareWrapper = styled(UnstyledButton)`
  padding: ${SQUARE_PADDING}px;
  cursor: default;
`;

const DifficultySquare = styled.div`
  width: ${SQUARE_SIZE}px;
  height: ${SQUARE_SIZE}px;
  border-radius: 3px;
  background-color: ${props => (props.isOn ? props.color : COLORS.gray[700])};
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${COLORS.white};
`;

const Artist = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: ${COLORS.gray[300]};
`;

export default SongsTableRow;
