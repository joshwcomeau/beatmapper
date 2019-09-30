import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './Layout';
import DocPage from './DocPage';

const Docs = () => {
  return (
    <Layout>
      <Switch>
        <Route
          path="/"
          render={() => <DocPage documentFilename="about.mdx" />}
        />
      </Switch>
    </Layout>
  );
};

export default Docs;
