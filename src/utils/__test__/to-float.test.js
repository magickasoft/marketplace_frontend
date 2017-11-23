import test from 'ava';
import {
    Left,
    Right
} from 'data.either';

import {
    toFloat
} from '..';


test(t => {
    const str1 = '123.456';
    const str2 = '123.foo';

    t.deepEqual(toFloat(str1), Right(123.456));
    t.deepEqual(toFloat(str2), Left(`Could not convert string '${str2}' to an Float`));
});
