import test from 'ava';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    filterMap
} from '..';


test('throws when predicate returns not a Maybe', t => {
    const arr1 = [ 1, 2, 3 ];
    const arr2 = [ Just(1), Nothing(), Nothing(), Just(4) ];
    const filterMapSquare = filterMap(a => a * 2);

    t.throws(() => filterMapSquare(arr1), /map is not a function/);
    t.throws(() => filterMapSquare(arr2), /map is not a function/);
});

test('returns correct result from List a', t => {
    const arr = [ 1, 2, 3, 4 ];
    const actual = filterMap(a => a < 3 ? Nothing() : Just(a.toString()), arr);
    const expected = [ '3', '4' ];

    t.not(actual, arr);
    t.deepEqual(actual, expected);
});

test('returns correct result from List Maybe a', t => {
    const arr = [ Just(1), Nothing(), Just(3), Nothing() ];
    const actual = filterMap(mA => mA.map(a => a.toString()), arr);
    const expected = [ '1', '3' ];

    t.not(actual, arr);
    t.deepEqual(actual, expected);
});

test('curried is correct', t => {
    const arr1 = [ 1, 2, 3, 4 ];
    const arr2 = [ 4, 5, 6, 7 ];
    const squareEven = a => a % 2 === 0 ? Just(a * a) : Nothing();
    const filterMapSquareEven = filterMap(squareEven);
    const expected1 = [ 4, 16 ];
    const expected2 = [ 16, 36 ];

    t.deepEqual(filterMapSquareEven(arr1), expected1);
    t.deepEqual(filterMapSquareEven(arr2), expected2);
});
