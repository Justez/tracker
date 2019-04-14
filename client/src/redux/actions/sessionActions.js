import * as types from './sessionActionTypes';
import * as path from '../../utils/routes/paths'

function receiveDetails(type, payload) {
  return { type, payload };
}

function startSessionAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_SESSION_LOADING, true));
        const request = fetch(process.env.REACT_APP_PROXY + '/sessions/new', {
            method: 'POST',
            mode: process.env.NODE_ENV === "development" ? 'cors' : 'no-cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(getState().form.signin.values),
        })

        return request.then(
            response => {
                response.json()
                .then((info) => {
                    dispatch(receiveDetails(types.ADD_SESSION_ID, info.id));
                    dispatch(receiveDetails(types.SET_SESSION_EXPIRY, info.expiry));
                    dispatch(receiveDetails(types.SET_USER_EMAIL, info.email));
                    dispatch(receiveDetails(types.SET_USER_ID, info.userId));
                    dispatch(receiveDetails(types.SET_SESSION_STATUS, info.status === 200));
                    info.warning && dispatch(receiveDetails(types.SET_SESSION_WARNING, info.warning))
                    info.error && dispatch(receiveDetails(types.SET_SESSION_LOGIN_ERROR, info.error))
                    if (info.status === 200)
                        dispatch(registerViewAction(path.dashboardPath));
                    if (info.status === 401) {
                        setTimeout(() => {
                            dispatch(registerViewAction(path.registerPath))
                            info.warning && dispatch(receiveDetails(types.SET_SESSION_WARNING, ''))
                            info.error && dispatch(receiveDetails(types.SET_SESSION_LOGIN_ERROR, ''))
                        }, 1500);
                    }
                })
            }, 
            err => dispatch(receiveDetails(types.SET_SESSION_LOGIN_ERROR, err)),
        )
        .finally(() => setTimeout(() => dispatch(receiveDetails(types.SET_SESSION_LOADING, false)), 0));
    }
} 

function endSessionAction() {
    return function action(dispatch) {
        dispatch(receiveDetails(types.SET_SESSION_LOADING, true));
        dispatch(receiveDetails(types.ADD_SESSION_ID, ''));
        dispatch(receiveDetails(types.SET_SESSION_EXPIRY, ''));
        dispatch(receiveDetails(types.SET_USER_EMAIL, ''));
        dispatch(receiveDetails(types.SET_USER_ID, ''));
        dispatch(receiveDetails(types.SET_SESSION_WARNING, ''))
        dispatch(receiveDetails(types.SET_SESSION_LOGIN_ERROR, ''))
        dispatch(receiveDetails(types.SET_SESSION_STATUS, false));
        dispatch(receiveDetails(types.SET_SESSION_LOADING, false));
        dispatch(registerViewAction(path.homePath));
  }
}

function registerViewAction(name) {
    return function action(dispatch) {
        dispatch(receiveDetails(types.SET_SESSION_VIEW, name));
    }
}

export {
    endSessionAction,
    registerViewAction,
    startSessionAction,
};