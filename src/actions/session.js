import {
    batchActions
} from 'redux-batched-actions';
import {
    merge
} from 'actions/data';

import {
    receiveCountries as receiveCountriesRequest
} from 'services/campaign-manager';


export const USER_LOGIN = 'SESSION/USER_LOGIN';

export function userLogin(bunch, role) {
    return {
        type: USER_LOGIN,
        payload: { bunch, role }
    };
}

export const USER_LOGOUT = 'SESSION/USER_LOGOUT';

export function userLogout() {
    return {
        type: USER_LOGOUT
    };
}

export const RECEIVE_COUNTRIES_START = 'SESSION/RECEIVE_COUNTRIES_START';

export function receiveCountriesStart() {
    return {
        type: RECEIVE_COUNTRIES_START
    };
}

export const RECEIVE_COUNTRIES_FAILURE = 'SESSION/RECEIVE_COUNTRIES_FAILURE';

export function receiveCountriesFailure(errors) {
    return {
        type: RECEIVE_COUNTRIES_FAILURE,
        payload: errors
    };
}

export const RECEIVE_COUNTRIES_SUCCESS = 'SESSION/RECEIVE_COUNTRIES_SUCCESS';

export function receiveCountriesSuccess(results) {
    return {
        type: RECEIVE_COUNTRIES_SUCCESS,
        payload: results
    };
}

export const receiveCountries = () => (dispatch, getState) => {
    const { session } = getState();

    if (session.countries.busy) {
        return Promise.resolve();
    }

    return session.countries.results
        .cata({
            Nothing: () => {
                dispatch(
                    receiveCountriesStart()
                );

                return receiveCountriesRequest()
                    .then(({ result, entities }) => {
                        dispatch(
                            batchActions([
                                receiveCountriesSuccess(result),
                                merge(entities)
                            ])
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            receiveCountriesFailure(errors)
                        );
                    });
            },

            Just: () => Promise.resolve()
        });
};
