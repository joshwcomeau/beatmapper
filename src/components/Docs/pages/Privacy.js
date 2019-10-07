import React from 'react';
import Doc, { frontMatter, tableOfContents } from '../../../docs/privacy.mdx';

import DocPage from '../DocPage';

const Page = () => {
  return (
    <DocPage tableOfContents={tableOfContents()} {...frontMatter}>
      <Doc />
    </DocPage>
  );
};

export default Page;
