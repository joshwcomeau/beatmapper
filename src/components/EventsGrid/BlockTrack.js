import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import {
  getSelectedEventEditMode,
  getSelectedEventTool,
  getSelectedEventColor,
} from '../../reducers/editor.reducer';
import {
  makeGetEventsForTrack,
  makeGetInitialTrackLightingColorType,
} from '../../reducers/editor-entities.reducer/events-view.reducer';
import usePointerUpHandler from '../../hooks/use-pointer-up-handler.hook';

import EventBlock from './EventBlock';
import BackgroundBox from './BackgroundBox';
import { getBackgroundBoxes } from './BlockTrack.helpers';
import { getSelectedSong } from '../../reducers/songs.reducer';

const BlockTrack = ({
  song,
  trackId,
  width,
  height,
  startBeat,
  numOfBeatsToShow,
  cursorAtBeat,
  events,
  areLasersLocked,
  isDisabled,
  selectedTool,
  selectedColorType,
  selectedEditMode,
  initialTrackLightingColorType,
  placeEvent,
}) => {
  const [mouseButtonDepressed, setMouseButtonDepressed] = React.useState(null);

  const handlePointerUp = React.useCallback(() => {
    setMouseButtonDepressed(null);
  }, []);

  usePointerUpHandler(!!mouseButtonDepressed, handlePointerUp);

  const getPropsForPlacedEvent = () => {
    const isRingEvent = trackId === 'largeRing' || trackId === 'smallRing';
    const eventType = isRingEvent ? 'rotate' : selectedTool;

    let eventColorType = selectedColorType;
    if (isRingEvent || selectedTool === 'off') {
      eventColorType = undefined;
    }

    return [
      trackId,
      cursorAtBeat,
      eventType,
      eventColorType,
      undefined,
      areLasersLocked,
    ];
  };

  const handleClickTrack = () => {
    placeEvent(...getPropsForPlacedEvent());
  };

  React.useEffect(() => {
    if (selectedEditMode === 'place' && mouseButtonDepressed === 'left') {
      // TODO: Technically this should be a new action, bulkPlaceEVent, so that
      // they can all be undoed in 1 step
      placeEvent(...getPropsForPlacedEvent());
    }
    // eslint-disable-next-line
  }, [selectedEditMode, cursorAtBeat]);

  const backgroundBoxes = getBackgroundBoxes(
    events,
    trackId,
    initialTrackLightingColorType,
    startBeat,
    numOfBeatsToShow
  );

  return (
    <Wrapper
      style={{ height }}
      isDisabled={isDisabled}
      onPointerDown={ev => {
        if (isDisabled || selectedEditMode === 'select') {
          return;
        }

        if (ev.buttons === 1) {
          handleClickTrack();
          setMouseButtonDepressed('left');
        } else if (ev.buttons === 2) {
          setMouseButtonDepressed('right');
        }
      }}
      onContextMenu={ev => ev.preventDefault()}
    >
      {backgroundBoxes.map(box => (
        <BackgroundBox
          key={box.id}
          song={song}
          box={box}
          startBeat={startBeat}
          numOfBeatsToShow={numOfBeatsToShow}
        />
      ))}

      {events.map(event => {
        return (
          <EventBlock
            key={event.id}
            event={event}
            trackWidth={width}
            trackId={trackId}
            startBeat={startBeat}
            numOfBeatsToShow={numOfBeatsToShow}
            deleteOnHover={
              selectedEditMode === 'place' && mouseButtonDepressed === 'right'
            }
            areLasersLocked={areLasersLocked}
          />
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLORS.blueGray[400]};
  opacity: ${p => p.isDisabled && 0.5};
  cursor: ${p => p.isDisabled && 'not-allowed'};
  background-color: ${p => p.isDisabled && 'rgba(255,255,255,0.2)'};

  &:last-of-type {
    border-bottom: none;
  }
`;

const makeMapStateToProps = (state, { trackId }) => {
  const getEventsForTrack = makeGetEventsForTrack(trackId);
  const getInitialTrackLightingColorType = makeGetInitialTrackLightingColorType(
    trackId
  );

  const mapStateToProps = state => {
    const song = getSelectedSong(state);
    const events = getEventsForTrack(state);
    const selectedEditMode = getSelectedEventEditMode(state);
    const selectedTool = getSelectedEventTool(state);
    const selectedColorType = getSelectedEventColor(state);

    const initialTrackLightingColorType = getInitialTrackLightingColorType(
      state
    );

    return {
      song,
      events,
      selectedEditMode,
      selectedTool,
      selectedColorType,
      initialTrackLightingColorType,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = {
  placeEvent: actions.placeEvent,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(React.memo(BlockTrack));
