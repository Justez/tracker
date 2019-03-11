import * as types from './accountActionTypes';
import * as navigate from '../../utils/routes/navigators'

function receiveDetails(type, payload) {
  return { type, payload };
}

function getUserDevicesAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_USER_DATA_LOADING, true));
        const request = fetch('/accounts/devices/all', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: getState().session.email, id: getState().session.userID }),
        })

        return request.then(
            response => {
                response.json().then((info) => {
                    dispatch(receiveDetails(types.SET_TRANSACTION_STATUS, info.status))
                    dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                    info.error && info.status !== 204 && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, info.error))
                    info.status === 404 && setTimeout(() => {
                        info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                        // dispatch(navigate.toRegister)
                    }, 2000);
                    info.status === 200 && dispatch(receiveDetails(types.SET_USER_DEVICES, info.devices));
                })
            }, 
            err => dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, err))
        )
        .finally(() => 
            dispatch(receiveDetails(types.SET_USER_DATA_LOADING, false))
        );
  }
}

function registerDeviceAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_USER_DATA_LOADING, true));
        const request = fetch('/accounts/devices/new', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ device: getState().form.addTracker.values, email: getState().session.email, id: getState().session.id }),
        })

        return request.then(
            response => {
                response.json().then((info) => {
                    dispatch(receiveDetails(types.SET_TRANSACTION_STATUS, info.status))
                    info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, info.error || 'Unable to create device account'))
                    info.status === 404 && setTimeout(() => {
                        info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                        dispatch(navigate.toRegister)
                    }, 2000);
                    info.status === 200 && dispatch(receiveDetails(types.SET_USER_DEVICES, info.devices));
                })
            }, 
            err => dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, err))
        )
        .finally(() => 
            dispatch(receiveDetails(types.SET_USER_DATA_LOADING, false))
        );
    }
}

function getUserDataAction() {
    return function action(dispatch, getState) {
  }
} 

export {
    getUserDataAction,
    getUserDevicesAction,
    registerDeviceAction,
};