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
                    dispatch(receiveDetails(types.ADD_SESSION_ID, info.id));
                    dispatch(receiveDetails(types.SET_SESSION_EXPIRY, info.expiry));
                    dispatch(receiveDetails(types.SET_USER_EMAIL, info.email));
                    dispatch(receiveDetails(types.SET_SESSION_STATUS, info.status === 200));
                    dispatch(receiveDetails(types.SET_SESSION_LOADING, false));
                    info.warning && dispatch(receiveDetails(types.ADD_SESSION_WARNING, info.warning))
                    info.error && dispatch(receiveDetails(types.ADD_SESSION_LOGIN_ERROR, info.error))
                    if (info.status === 200) 
                        dispatch(navigate.toDashboard);
                    if (info.status === 404) {
                        setTimeout(navigate.toRegister, 2000);
                    }
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