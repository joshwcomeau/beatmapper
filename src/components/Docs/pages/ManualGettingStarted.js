import React from 'react';
import { importMDX } from 'mdx.macro';

import DocPage from '../DocPage';

const Doc = importMDX.sync('../../../docs/manual-getting-started.mdx');

const Intro = () => {
  return (
    <DocPage title="Getting Started" subtitle="User Manual">
      <Doc />
    </DocPage>
  );
};

export default Intro;
