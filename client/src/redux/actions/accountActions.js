import * as types from './accountActionTypes';
import * as path from '../../utils/routes/paths';
import { registerViewAction } from './sessionActions';

function receiveDetails(type, payload) {
  return { type, payload };
}

function getUserDevicesAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_USER_DATA_LOADING, true));
        const request = fetch(process.env.REACT_APP_PROXY + '/accounts/devices/all', {
            method: 'POST',
            mode: 'no-cors',
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
                    info.status === 401 && setTimeout(() => {
                        info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                        // dispatch(navigate.toRegister)
                    }, 2000);
                    info.status === 200 && dispatch(receiveDetails(types.SET_USER_DEVICES, info.devices));
                })
            }, 
            err => dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, err))
        )
        .finally(() => 
            setTimeout(() => dispatch(receiveDetails(types.SET_USER_DATA_LOADING, false)), 100)
        );
  }
}

function registerDeviceAction() {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_USER_DATA_LOADING, true));
        const request = fetch(process.env.REACT_APP_PROXY + '/accounts/devices/new', {
            method: 'POST',
            mode: 'no-cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ device: getState().form.addTracker.values, email: getState().session.email, id: getState().session.id }),
        })

        return request.then(
            response => {
                response.json().then((info) => {
                    dispatch(receiveDetails(types.SET_TRANSACTION_STATUS, info.status))
                    info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, info.error || 'Unable to create device account'))
                    info.status === 401 && setTimeout(() => {
                        info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                        dispatch(registerViewAction(path.registerPath))
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

function deleteDeviceAction(device) {
    return function action(dispatch, getState) {
        dispatch(receiveDetails(types.SET_USER_DATA_LOADING, true));
        const request = fetch(process.env.REACT_APP_PROXY + '/accounts/devices/delete', {
            method: 'DELETE',
            mode: 'no-cors',
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ device, email: getState().session.email, id: getState().session.userID }),
        });

        return request.then(
            response => {
                response.json().then((info) => {
                    info.status === 200 && 
                    dispatch(
                        receiveDetails(
                            types.SET_USER_DEVICES, 
                            getState().account.devices.filter(d => d.id !== device.id)
                        )
                    );
                    info.error && dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, info.error || 'Unable to delete device.'))
                    info.error && setTimeout(() => {
                        dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, ''))
                    }, 4000);
                })
            }, 
            err => dispatch(receiveDetails(types.SET_TRANSACTION_ERROR, err))
        )
        .finally(() => 
            dispatch(receiveDetails(types.SET_USER_DATA_LOADING, false))
        );
    }
}

export {
    getUserDevicesAction,
    registerDeviceAction,
    deleteDeviceAction,
};