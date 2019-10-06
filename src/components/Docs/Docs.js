import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import Intro from './pages/Intro';
import SongPrep from './pages/SongPrep';
import ManualGettingStarted from './pages/ManualGettingStarted';
import ManualNotes from './pages/ManualNotes';

const Docs = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/docs" component={Intro} />
        <Route path="/docs/song-prep" component={SongPrep} />
        <Route path="/docs/getting-started" component={ManualGettingStarted} />
        <Route path="/docs/notes-view" component={ManualNotes} />
      </Switch>
    </Layout>
  );
};

export default Docs;
