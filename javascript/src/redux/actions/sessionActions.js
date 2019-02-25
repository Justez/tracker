import * as types from './sessionActionTypes';
import * as navigate from '../../utils/routes/navigators'

export function receiveDetails(type, payload) {
  return { type, payload };
}

export function startSessionAction(loginDetails) {
    return function action(dispatch) {
        const request = fetch('/sessions/new', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        })

        return request.then(
            response => {
                response.json().then((info) => {
                    dispatch(receiveDetails(types.ADD_SESSION_TOKEN, info.token));
                    dispatch(receiveDetails(types.ADD_SESSION_USER_NAME, info.name));
                    dispatch(receiveDetails(types.SET_SESSION_EXPIRY, info.expiry));
                    dispatch(receiveDetails(types.SET_SESSION_STATUS, true));
                    dispatch(navigate.toDashboard);
                })
            }, 
            err => dispatch(receiveDetails(types.ADD_SESSION_LOGIN_ERROR, err)),
        )
  }
}

export default {
    startSessionAction,
};