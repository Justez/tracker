import initialState from './initialState';
import * as sessionActions from '../actions/sessionActionTypes';

export default function session(state = initialState.session, action) {
  const newState = name => ({ ...state, [name]: action.payload });

  switch (action.type) {
    case sessionActions.SET_SESSION_STATUS:
      return newState('active');
    case sessionActions.SET_SESSION_EXPIRY:
      return newState('expiry');
    case sessionActions.SET_SESSION_LOADING:
      return newState('loading');
    case sessionActions.SET_USER_EMAIL: 
      return newState('email');
    case sessionActions.SET_USER_ID: 
      return newState('userID');
    case sessionActions.ADD_SESSION_ID: 
      return newState('id');
    case sessionActions.SET_SESSION_LOGIN_ERROR:
      return newState('error');
    case sessionActions.SET_SESSION_WARNING:
      return newState('warning');
    case sessionActions.SET_SESSION_VIEW: 
      return newState('view');
    default:
      return state;
  }
}