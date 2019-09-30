import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { getHasInitialized } from '../../reducers/global.reducer';

import Home from '../Home';
import Editor from '../Editor';
import Docs from '../Docs';
import DevTools from '../DevTools';
import GlobalStyles from '../GlobalStyles';
import LoadingScreen from '../LoadingScreen';

import 'react-tippy/dist/tippy.css';

const App = ({ hasInitialized }) => {
  if (!hasInitialized) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/edit/:songId/:difficulty" component={Editor} />
        <Route path="/docs" component={Docs} />
      </Router>
      <DevTools />
      <GlobalStyles />
    </>
  );
};

const mapStateToProps = state => ({
  hasInitialized: getHasInitialized(state),
});

export default connect(mapStateToProps)(App);
