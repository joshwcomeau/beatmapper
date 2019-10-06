import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import Intro from './pages/Intro';
import SongPrep from './pages/SongPrep';
import ManualGettingStarted from './pages/ManualGettingStarted';

const Docs = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/docs" render={() => <Intro />} />
        <Route path="/docs/song-prep" render={() => <SongPrep />} />
        <Route
          path="/docs/getting-started"
          render={() => <ManualGettingStarted />}
        />
      </Switch>
    </Layout>
  );
};

export default Docs;
