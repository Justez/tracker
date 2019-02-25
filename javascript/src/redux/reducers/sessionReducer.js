import initialState from './initialState';
import * as sessionActions from '../actions/sessionActionTypes';

export default function session(state = initialState.session, action) {
  const newState = name => ({ ...state, [name]: action.payload });

  switch (action.type) {
    case sessionActions.SET_SESSION_STATUS:
      return newState('active');
    case sessionActions.SET_SESSION_TOKEN:
      return newState('token');
    case sessionActions.SET_SESSION_EXPIRY:
      return newState('expiry');
    case sessionActions.SET_SESSION_LOADING:
      return newState('loading');
    case sessionActions.ADD_SESSION_USER_NAME: 
      return newState('name');
    case sessionActions.ADD_SESSION_USER_ID: 
      return newState('id');
    case sessionActions.ADD_SESSION_LOGIN_ERROR:
      return newState('error');
    case sessionActions.ADD_SESSION_WARNING:
      return newState('warning');
    default:
      return state;
  }
}