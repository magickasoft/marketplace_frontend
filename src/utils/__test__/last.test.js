import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    last
} from '..';


test(t => {
    const arr1 = [
        uniqueId('el'),
        uniqueId('el'),
        uniqueId('el')
    ];
    const arr2 = [];

    t.deepEqual(last(arr1), Just(arr1[ 2 ]));
    t.deepEqual(last(arr2), Nothing());
});
