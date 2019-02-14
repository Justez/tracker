import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './redux/store/configureStore';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

const store = configureStore();

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>, 
    document.getElementById('root')
);

serviceWorker.unregister();
