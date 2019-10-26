import React from 'react';
import { ChromePicker } from 'react-color';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';

import UnstyledButton from '../UnstyledButton';

const ColorPicker = ({ colorId, color, updateColor }) => {
  const [showPicker, setShowPicker] = React.useState(false);

  return (
    <Wrapper>
      <ColorPreview
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(true)}
      />
      {showPicker && (
        <OutsideClickHandler onOutsideClick={() => setShowPicker(false)}>
          <PickerWrapper>
            <ChromePicker
              color={color}
              onChange={colorInfo => updateColor(colorId, colorInfo.hex)}
            />
          </PickerWrapper>
        </OutsideClickHandler>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const ColorPreview = styled(UnstyledButton)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
`;

const PickerWrapper = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
`;

export default React.memo(ColorPicker);
