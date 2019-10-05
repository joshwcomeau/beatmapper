import React from 'react';

import Document, {
  frontMatter,
  tableOfContents,
} from '../../../docs/manual-getting-started.mdx';

import DocPage from '../DocPage';

console.log({ frontMatter, tableOfContents });

const Intro = () => {
  return (
    <DocPage title="Getting Started" subtitle="User Manual">
      <Document />
    </DocPage>
  );
};

export default Intro;
