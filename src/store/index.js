import {
    createStore as createStore_,
    applyMiddleware,
    compose
} from 'redux';
import {
    routerMiddleware
} from 'react-router-redux';
import {
    browserHistory
} from 'react-router';
import thunk from 'redux-thunk';
import {
    enableBatching
} from 'redux-batched-actions';

import {
    reducer,
    initialState
} from 'reducers';

export function getMiddlewares() {
    const middlewares = [
        thunk,
        routerMiddleware(browserHistory)
    ];

    return middlewares;
}

function getPreloadedState() {
    // FIXME
    // if ('__REDUX_DEVTOOLS_EXTENSION__' in window) {
    //     return window.__REDUX_DEVTOOLS_EXTENSION__();
    // }

    return initialState;
}

function getEnhancer() {
    const chain = [
        applyMiddleware(...getMiddlewares())
    ];

    if (__DEVELOPMENT__) {
        chain.push(
            require('containers/DevTools').default.instrument(),
            require('redux-devtools').persistState(
                window.location.href.match(/[?&]debug_session=([^&#]+)\b/)
            )
        );
    }

    return compose(...chain);
}

export function createStore() {
    const store = createStore_(enableBatching(reducer), getPreloadedState(), getEnhancer());

    if (__DEVELOPMENT__ && module.hot) {
        module.hot.accept('reducers', () =>
            store.replaceReducer(
                enableBatching(
                    require('reducers').reducer
                )
            )
        );
    }

    return store;
}
