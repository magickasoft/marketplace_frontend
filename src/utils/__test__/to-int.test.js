import test from 'ava';
import {
    Left,
    Right
} from 'data.either';

import {
    toInt
} from '..';


test(t => {
    const str1 = '123';
    const str2 = '456.789';
    const str3 = '123.foo';

    t.deepEqual(toInt(str1), Right(123));
    t.deepEqual(toInt(str2), Right(456));
    t.deepEqual(toInt(str3), Left(`Could not convert string '${str3}' to an Int`));
});
