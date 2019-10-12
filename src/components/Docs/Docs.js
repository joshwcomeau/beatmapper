import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import Intro from './pages/Intro';
import SongPrep from './pages/SongPrep';
import Shortcuts from './pages/Shortcuts';
import ManualGettingStarted from './pages/ManualGettingStarted';
import ManualNotes from './pages/ManualNotes';
import ManualEvents from './pages/ManualEvents';
import ManualPublishing from './pages/ManualDownloadingPublishing';
import Migrating from './pages/Migrating';
import Privacy from './pages/Privacy';
import ContentPolicy from './pages/ContentPolicy';

const Docs = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/docs" component={Intro} />
        <Route path="/docs/song-prep" component={SongPrep} />
        <Route path="/docs/keyboard-shortcuts" component={Shortcuts} />
        <Route path="/docs/getting-started" component={ManualGettingStarted} />
        <Route path="/docs/notes-view" component={ManualNotes} />
        <Route path="/docs/events-view" component={ManualEvents} />
        <Route path="/docs/publishing" component={ManualPublishing} />
        <Route path="/docs/migrating" component={Migrating} />
        <Route path="/docs/privacy" component={Privacy} />
        <Route path="/docs/content-policy" component={ContentPolicy} />
      </Switch>
    </Layout>
  );
};

export default Docs;
