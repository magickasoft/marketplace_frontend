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
    merge
} from 'actions/data';
import {
    authStart,
    authSuccess,
    authFailure,
    auth,
    __RewireAPI__
} from '../auth';


const stub$authRequest = sinon.stub();
const stub$userLogin = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        authRequest: stub$authRequest,
        userLogin: stub$userLogin
    });
});

test.beforeEach(() => {
    stub$authRequest.reset();
    stub$authRequest.resetBehavior();
    stub$userLogin.reset();
    stub$userLogin.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('ui is busy', t => {
    t.plan(2);

    const state = {
        ui: {
            auth: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(auth())
        .then(() => {
            t.false(stub$authRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(1);

    const state = {
        ui: {
            auth: {
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    const role = uniqueId('role');
    stub$authRequest
        .onFirstCall().returns(Promise.resolve([ response, role ]));

    const userLoginAction = uniqueId('userLogin');
    stub$userLogin
        .withArgs(response.result, role)
        .onFirstCall().returns(userLoginAction);

    return store.dispatch(auth())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    authStart(),
                    batchActions([
                        authSuccess(),
                        merge(response.entities),
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
            auth: {
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$authRequest
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(auth())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    authStart(),
                    authFailure(errors)
                ]
            );
        });
});
