import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    get
} from '..';


test('returns correct results', t => {
    const key1 = uniqueId('key');
    const key2 = uniqueId('key');
    const dict = {
        [ key1 ]: uniqueId('value')
    };

    t.deepEqual(get(key1, dict), Just(dict[ key1 ]));
    t.deepEqual(get(key2, dict), Nothing());
});
