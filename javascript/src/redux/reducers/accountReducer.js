import initialState from './initialState';
import * as accountActions from '../actions/accountActionTypes';

export default function account(state = initialState.account, action) {
  const newState = name => ({ ...state, [name]: action.payload });

  switch (action.type) {
    case accountActions.SET_USER_DEVICES:
      return newState('devices');
    case accountActions.SET_USER_DATA_LOADING:
      return newState('loading');
    case accountActions.SET_TRANSACTION_ERROR:
      return newState('error');
    case accountActions.SET_TRANSACTION_STATUS:
      return newState('status');
    default:
      return state;
  }
}