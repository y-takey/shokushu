'use strict';

import React from 'react';

export class List extends React.Component {
  state = {
    message: 'Hello, Electron3'
  };
  constructor () {
    super();
  };
  render() {
    return (
      <div className="container">
        <div className="jumbotron main">
          <h1>{this.state.message}</h1>
        </div>
      </div>
    );
  };
}
