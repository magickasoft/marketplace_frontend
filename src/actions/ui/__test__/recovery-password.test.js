import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    batchActions
} from 'redux-batched-actions';
import {
    uniqueId,
    random
} from 'lodash/fp';

import {
    getMiddlewares
} from 'store';
import {
    recoveryPasswordStart,
    recoveryPasswordSuccess,
    recoveryPasswordFailure,
    recoveryPassword,
    __RewireAPI__
} from '../recovery-password';
import {
    successNotification
} from '../notification';


const stub$recoveryPasswordRequest = sinon.stub();
const stub$Cookie = {
    set: sinon.stub()
};
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        recoveryPasswordRequest: stub$recoveryPasswordRequest,
        Cookie: stub$Cookie
    });
});

test.beforeEach(() => {
    stub$recoveryPasswordRequest.reset();
    stub$recoveryPasswordRequest.resetBehavior();
    stub$Cookie.set.reset();
    stub$Cookie.set.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('ui is busy', t => {
    t.plan(2);

    const state = {
        ui: {
            recoveryPassword: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(recoveryPassword())
        .then(() => {
            t.false(stub$recoveryPasswordRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(2);

    const state = {
        ui: {
            recoveryPassword: {
                fields: {
                    email: uniqueId('email')
                },
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const params = {
        token: uniqueId('token'),
        timeout: random(1, 100) / 60 / 60 / 24,
        message: 'Success message'
    };
    stub$recoveryPasswordRequest
        .withArgs(state.ui.recoveryPassword.fields)
        .onFirstCall().returns(Promise.resolve(params));

    return store.dispatch(recoveryPassword())
        .then(() => {
            t.true(
                stub$Cookie.set.calledWithExactly('resotre_password_token', params.token, {
                    expires: params.timeout
                })
            );

            t.deepEqual(
                store.getActions(),
                [
                    recoveryPasswordStart(),
                    batchActions([
                        recoveryPasswordSuccess(params),
                        successNotification({
                            message: params.message,
                            position: 'tc',
                            autoDismiss: 5
                        })
                    ])
                ]
            );
        });
});

test.serial('failure', t => {
    t.plan(1);

    const state = {
        ui: {
            recoveryPassword: {
                fields: uniqueId('fields'),
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$recoveryPasswordRequest
        .withArgs(state.ui.recoveryPassword.fields)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(recoveryPassword())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    recoveryPasswordStart(),
                    recoveryPasswordFailure(errors)
                ]
            );
        });
});
