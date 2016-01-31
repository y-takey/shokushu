import { combineReducers } from 'redux';
import home from './home';
import viewer from './viewer';

const rootReducer = combineReducers({
  home,
  viewer
});

export default rootReducer;
