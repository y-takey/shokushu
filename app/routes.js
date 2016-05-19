import _ from 'lodash';
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ViewerPage from './containers/ViewerPage';

let pageYOffset = 0;
const onLeave = () => {
  pageYOffset = window.pageYOffset;
}
const onEnter = (location, replaceWith) => {
  _.defer( () => { window.scrollTo(0, pageYOffset) })
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} onLeave={onLeave} onEnter={onEnter} />
    <Route path="/viewer/:filename" component={ViewerPage} />
  </Route>
);
