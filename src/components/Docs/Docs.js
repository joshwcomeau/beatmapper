import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import Intro from './pages/Intro';
import SongPrep from './pages/SongPrep';
import Shortcuts from './pages/Shortcuts';
import ManualGettingStarted from './pages/ManualGettingStarted';
import ManualNavigatingTheEditor from './pages/ManualNavigatingTheEditor';
import ManualNotes from './pages/ManualNotes';
import ManualEvents from './pages/ManualEvents';
import ManualDemo from './pages/ManualDemo';
import ManualPublishing from './pages/ManualDownloadingPublishing';
import Migrating from './pages/Migrating';
import Mods from './pages/Mods';
import FastWalls from './pages/FastWalls';
import RunningLocally from './pages/RunningLocally';
import ReleaseNotes from './pages/ReleaseNotes';
import Privacy from './pages/Privacy';
import ContentPolicy from './pages/ContentPolicy';

const Docs = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/docs" component={Intro} />
        <Route path="/docs/song-prep" component={SongPrep} />
        <Route path="/docs/keyboard-shortcuts" component={Shortcuts} />
        <Route
          path="/docs/manual/getting-started"
          component={ManualGettingStarted}
        />
        <Route
          path="/docs/manual/navigating-the-editor"
          component={ManualNavigatingTheEditor}
        />
        <Route path="/docs/manual/notes-view" component={ManualNotes} />
        <Route path="/docs/manual/events-view" component={ManualEvents} />
        <Route path="/docs/manual/demo-view" component={ManualDemo} />
        <Route path="/docs/manual/publishing" component={ManualPublishing} />
        <Route path="/docs/migrating" component={Migrating} />
        <Route path="/docs/mods" component={Mods} />
        <Route path="/docs/fast-walls" component={FastWalls} />
        <Route path="/docs/running-locally" component={RunningLocally} />
        <Route path="/docs/release-notes" component={ReleaseNotes} />
        <Route path="/docs/privacy" component={Privacy} />
        <Route path="/docs/content-policy" component={ContentPolicy} />
      </Switch>
    </Layout>
  );
};

export default Docs;
