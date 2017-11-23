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
    loginStart,
    loginSuccess,
    loginFailure,
    login,
    __RewireAPI__
} from '../login';


const stub$loginRequest = sinon.stub();
const stub$userLogin = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        loginRequest: stub$loginRequest,
        userLogin: stub$userLogin
    });
});

test.beforeEach(() => {
    stub$loginRequest.reset();
    stub$loginRequest.resetBehavior();
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
            login: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(login())
        .then(() => {
            t.false(stub$loginRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(1);

    const state = {
        ui: {
            login: {
                fields: uniqueId('fields'),
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
    stub$loginRequest
        .withArgs(state.ui.login.fields)
        .onFirstCall().returns(Promise.resolve([ response, role ]));

    const userLoginAction = uniqueId('userLogin');
    stub$userLogin
        .withArgs(response.result, role)
        .onFirstCall().returns(userLoginAction);

    return store.dispatch(login())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    loginStart(),
                    batchActions([
                        loginSuccess(),
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
            login: {
                fields: uniqueId('fields'),
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$loginRequest
        .withArgs(state.ui.login.fields)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(login())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    loginStart(),
                    loginFailure(errors)
                ]
            );
        });
});
