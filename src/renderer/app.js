'use strict';

import polifill from 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {List} from './components/list';

ReactDOM.render(React.createElement(List), document.getElementById('app'));
