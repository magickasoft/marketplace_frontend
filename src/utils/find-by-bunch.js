import {
    isEqual,
    compose,
    property,
    find,
    curry
} from 'lodash/fp';

const pBunch = property('bunch');

export const findByBunch = curry((list, bunch) => (
    find(compose(isEqual(bunch), pBunch), list)
));
