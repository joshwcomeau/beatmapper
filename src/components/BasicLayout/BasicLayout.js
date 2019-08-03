import React from 'react';

import { UNIT } from '../../constants';

import Header from '../Header';
import Footer from '../Footer';
import Spacer from '../Spacer';

const BasicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Spacer size={UNIT * 8} />
      {children}
      <Footer />
    </>
  );
};

export default BasicLayout;
