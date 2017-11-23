import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    head
} from '..';


test(t => {
    const arr1 = [
        uniqueId('el'),
        uniqueId('el'),
        uniqueId('el')
    ];
    const arr2 = [];

    t.deepEqual(head(arr1), Just(arr1[ 0 ]));
    t.deepEqual(head(arr2), Nothing());
});
