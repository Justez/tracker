import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './redux/store';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={<div>Loading</div>} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>, 
    document.getElementById('root')
);

serviceWorker.unregister();
