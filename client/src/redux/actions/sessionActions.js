import * as types from './sessionActionTypes';
import * as navigate from '../../utils/routes/navigators'

function receiveDetails(type, payload) {
  return { type, payload };
}

function startSessionAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_SESSION_LOADING, true));
        const request = fetch('/sessions/new', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
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
                        dispatch(navigate.toDashboard);
                    if (info.status === 401) {
                        setTimeout(() => {
                            dispatch(navigate.toRegister)
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
        dispatch(navigate.toHome);
  }
}

export {
    startSessionAction,
    endSessionAction,
};