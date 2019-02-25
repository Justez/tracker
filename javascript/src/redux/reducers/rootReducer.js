import {combineReducers} from 'redux';
import session from './sessionReducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  form: formReducer,
  session
});

export default rootReducer;