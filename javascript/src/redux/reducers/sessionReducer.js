import initialState from './initialState';
import * as sessionActions from '../actions/sessionActionTypes';

export default function session(state = initialState.session, action) {
  switch (action.type) {
    case sessionActions.ADD_SESSION_ID:
      console.log('ADD SESSION ID')
      return state;
    case sessionActions.START_SESSION:
        console.log('START_SESSION')
        return state;
    case sessionActions.SET_SESSION_EXPIRY:
        console.log('SET_SESSION_EXPIRY')
        return state;
    default:
      return state;
  }
}