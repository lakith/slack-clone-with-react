import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/AppContainer/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createStore,applyMiddleware,compose,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import AuthReducer from './store/reducer/authReducer'

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
    auth:AuthReducer
});

const store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)))

const app = (
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
