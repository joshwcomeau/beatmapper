import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { range } from '../../utils';

const GridPreview = ({ numRows, numCols, cellSize }) => {
  const cellSizeInPx = cellSize * 30;

  return (
    <Wrapper>
      {range(numRows).map(rowIndex => (
        <Row>
          {range(numCols).map(colIndex => (
            <Cell style={{ width: cellSizeInPx, height: cellSizeInPx }} />
          ))}
        </Row>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: 1px solid ${COLORS.yellow[500]};
`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div`
  border: 1px solid ${COLORS.yellow[500]};
`;

export default GridPreview;
