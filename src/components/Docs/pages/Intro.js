import React from 'react';

import DocPage from '../DocPage';

const Doc = React.lazy(() => import('../../../docs/intro.mdx'));

const Intro = ({ docFilename }) => {
  return (
    <DocPage title="Introduction" subtitle="About Beatmapper">
      <React.Suspense fallback="Loading...">
        <Doc />
      </React.Suspense>
    </DocPage>
  );
};

export default Intro;
