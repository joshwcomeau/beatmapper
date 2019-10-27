import React from 'react';
import { Icon } from 'react-icons-kit';
import { helpCircle } from 'react-icons-kit/feather/helpCircle';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

const QuestionTooltip = ({ children }) => {
  return (
    <Wrapper>
      <Tooltip interactive html={<HelpWrapper>{children}</HelpWrapper>}>
        <Icon size={14} icon={helpCircle} />
      </Tooltip>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: inline;
  font-size: inherit;
  color: inherit;
`;

const HelpWrapper = styled.div`
  max-width: 150px;
  line-height: 1.4;
`;

export default QuestionTooltip;
