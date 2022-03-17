import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import home from '../modules/home/HomeState';
import help from '../modules/help/HelpState'

export default combineReducers({
  // ## Generator Reducers
  app,
  home,
  help
});
