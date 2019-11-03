import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { arrowRightC } from 'react-icons-kit/ionicons/arrowRightC';

import { COLORS } from '../../constants';

const List = ({ children }) => <ListElem>{children}</ListElem>;

List.ListItem = ({ children }) => (
  <ListItemElem>
    <IconWrapper>
      <IconBase size={16} icon={arrowRightC} />
    </IconWrapper>
    <Children>{children}</Children>
  </ListItemElem>
);

const ListElem = styled.ul`
  font-size: 18px;
  font-weight: 300;
  margin-bottom: 2rem;
  line-height: 1.4;
`;

const ListItemElem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  padding-right: 16px;
  margin-top: -2px;
  color: ${COLORS.blue[500]};
`;

const Children = styled.div``;

export default List;
