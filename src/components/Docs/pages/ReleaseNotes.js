import React from 'react';
import Doc, {
  frontMatter,
  tableOfContents,
} from '../../../docs/release-notes.mdx';

import DocPage from '../DocPage';

const Page = () => {
  return (
    <DocPage tableOfContents={tableOfContents()} {...frontMatter}>
      <Doc />
    </DocPage>
  );
};

export default Page;
