import * as types from './sessionActionTypes';
import * as navigate from '../../utils/routes/navigators'

export function receiveDetails(type, payload) {
  return { type, payload };
}

export function startSessionAction(loginDetails) {
    return function action(dispatch) {
        dispatch(receiveDetails(types.SET_SESSION_LOADING, true));
        const request = fetch('/sessions/new', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(loginDetails),
        })

        return request.then(
            response => {
                response.json().then((info) => {
                    dispatch(receiveDetails(types.SET_SESSION_TOKEN, info.token));
                    dispatch(receiveDetails(types.ADD_SESSION_USER_NAME, info.name));
                    dispatch(receiveDetails(types.ADD_SESSION_USER_ID, info.id));
                    dispatch(receiveDetails(types.SET_SESSION_EXPIRY, info.expiry));
                    dispatch(receiveDetails(types.SET_SESSION_STATUS, true));
                    dispatch(receiveDetails(types.SET_SESSION_LOADING, false));
                    // dispatch(navigate.toDashboard);
                })
            }, 
            err => {
                dispatch(receiveDetails(types.ADD_SESSION_LOGIN_ERROR, err))
                dispatch(receiveDetails(types.SET_SESSION_LOADING, false));
            },
        )
  }
}

export default {
    startSessionAction,
};