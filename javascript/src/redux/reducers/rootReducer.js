import {combineReducers} from 'redux';
import session from './sessionReducer';
import account from './accountReducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  account,  
  form: formReducer,
  session,
});

export default rootReducer;