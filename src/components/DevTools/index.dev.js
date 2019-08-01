import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}
  >
    <FilterMonitor
      blacklist={['TICK']}
      statesFilter={state =>
        state.waveform.points
          ? { ...state, waveform: { ...state.waveform, points: '<snip>' } }
          : state
      }
    >
      <LogMonitor theme="tomorrow" />
    </FilterMonitor>
  </DockMonitor>
);

export default DevTools;
