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
    changePasswordStart,
    changePasswordSuccess,
    changePasswordFailure,
    changePassword,
    __RewireAPI__
} from '../change-password';
import {
    successNotification
} from '../notification';


const stub$changePasswordRequest = sinon.stub();
const stub$Cookie = {
    get: sinon.stub()
};
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        changePasswordRequest: stub$changePasswordRequest,
        Cookie: stub$Cookie
    });
});

test.beforeEach(() => {
    stub$changePasswordRequest.reset();
    stub$changePasswordRequest.resetBehavior();
    stub$Cookie.get.reset();
    stub$Cookie.get.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('ui is busy', t => {
    t.plan(2);

    const code = uniqueId('code');
    const state = {
        ui: {
            changePassword: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(changePassword(code))
        .then(() => {
            t.false(stub$changePasswordRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(1);

    const code = uniqueId('code');
    const state = {
        ui: {
            changePassword: {
                fields: {
                    foo: uniqueId('foo')
                },
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const token = uniqueId('token');
    stub$Cookie.get
        .withArgs('resotre_password_token')
        .onFirstCall().returns(token);

    stub$changePasswordRequest
        .withArgs({
            foo: state.ui.changePassword.fields.foo,
            token,
            code
        })
        .onFirstCall().returns(Promise.resolve());

    return store.dispatch(changePassword(code))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    changePasswordStart(),
                    batchActions([
                        changePasswordSuccess(),
                        successNotification({
                            message: 'Password has been changed successfull',
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

    const code = uniqueId('code');
    const state = {
        ui: {
            changePassword: {
                fields: {
                    foo: uniqueId('foo')
                },
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const token = uniqueId('token');
    stub$Cookie.get
        .withArgs('resotre_password_token')
        .onFirstCall().returns(token);

    const errors = uniqueId('errors');
    stub$changePasswordRequest
        .withArgs({
            foo: state.ui.changePassword.fields.foo,
            token,
            code
        })
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(changePassword(code))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    changePasswordStart(),
                    changePasswordFailure(errors)
                ]
            );
        });
});
