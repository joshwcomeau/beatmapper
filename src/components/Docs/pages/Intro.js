import React from 'react';
import { importMDX } from 'mdx.macro';

import DocPage from '../DocPage';

const Doc = importMDX.sync('../../../docs/intro.mdx');

const Intro = () => {
  return (
    <DocPage title="Introduction" subtitle="About Beatmapper">
      <Doc />
    </DocPage>
  );
};

export default Intro;
