import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    batchActions
} from 'redux-batched-actions';
import {
    uniqueId
} from 'lodash/fp';

import {
    getMiddlewares
} from 'store';
import {
    logoutStart,
    logoutSuccess,
    logoutFailure,
    logout,
    __RewireAPI__
} from '../logout';


const stub$logoutRequest = sinon.stub();
const stub$userLogout = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        logoutRequest: stub$logoutRequest,
        userLogout: stub$userLogout
    });
});

test.beforeEach(() => {
    stub$logoutRequest.reset();
    stub$logoutRequest.resetBehavior();
    stub$userLogout.reset();
    stub$userLogout.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('ui is busy', t => {
    t.plan(2);

    const state = {
        ui: {
            logout: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(logout())
        .then(() => {
            t.false(stub$logoutRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(1);

    const state = {
        ui: {
            logout: {
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    stub$logoutRequest
        .onFirstCall().returns(Promise.resolve());

    const userLoginAction = uniqueId('userLogout');
    stub$userLogout
        .onFirstCall().returns(userLoginAction);

    return store.dispatch(logout())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    logoutStart(),
                    batchActions([
                        logoutSuccess(),
                        userLoginAction
                    ])
                ]
            );
        });
});

test.serial('failure', t => {
    t.plan(1);

    const state = {
        ui: {
            logout: {
                fields: uniqueId('fields'),
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$logoutRequest
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(logout())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    logoutStart(),
                    logoutFailure(errors)
                ]
            );
        });
});
