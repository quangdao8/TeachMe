import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
// import storage from "redux-persist/es/storage";
import AsyncStorage from '@react-native-community/async-storage';

import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { ServiceHandle } from 'helper/index';
import * as types from 'actions/types';
const _ = require('lodash');

import rootReducers from 'reducers'; // where reducers is a object of reducers
import sagas from 'sagas';

const config = {
    timeout: 0,
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['alertReducer', 'drawerReducer'],
    debug: true //to get useful logging
};

const middleware = [];
const sagaMiddleware = createSagaMiddleware();
const handleAuthTokenMiddleware = store => next => action => {
    if (action.type === types.LOGIN_SUCCESS) {
        ServiceHandle.setToken(action.response.auth_token);
    }
    next(action);
};

middleware.push(sagaMiddleware, handleAuthTokenMiddleware);

if (__DEV__) {
    middleware.push(createLogger());
}

const reducers = persistCombineReducers(config, rootReducers);
const enhancers = [applyMiddleware(...middleware)];
// const initialState = {};
const persistConfig = { enhancers };
const store = createStore(reducers, undefined, compose(...enhancers));
const persistor = persistStore(store, persistConfig, () => {
    const stateData = store.getState();
    if (!_.isEmpty(stateData.userReducer) && !_.isEmpty(stateData.userReducer.data)) {
        ServiceHandle.setToken(stateData.userReducer.data.auth_token);
    }
});
const configureStore = () => {
    return { persistor, store };
};

sagaMiddleware.run(sagas);

export default configureStore;
