import test from 'ava';
import {
    forEach
} from 'lodash/fp';

import {
    isCountryManager,
    isSuperManager,
    isCountryEditor,
    isSuperEditor,
    isAdmin
} from '../user';


const check = fn => collections => t => {
    t.plan(32);

    forEach(
        ([ expected, type ]) => {
            t.is(fn(type), expected, `dec: ${type}, bin: ${type.toString(2)}`);
        },
        collections
    );
};

test(/* 10000 */ 'isCountryManager', check(isCountryManager)([
    /*  00000 */ [ false, 0 ],
    /*  00001 */ [ false, 1 ],
    /*  00010 */ [ false, 2 ],
    /*  00011 */ [ false, 3 ],
    /*  00100 */ [ false, 4 ],
    /*  00101 */ [ false, 5 ],
    /*  00110 */ [ false, 6 ],
    /*  00111 */ [ false, 7 ],
    /*  01000 */ [ false, 8 ],
    /*  01001 */ [ false, 9 ],
    /*  01010 */ [ false, 10 ],
    /*  01011 */ [ false, 11 ],
    /*  01100 */ [ false, 12 ],
    /*  01101 */ [ false, 13 ],
    /*  01110 */ [ false, 14 ],
    /*  01111 */ [ false, 15 ],
    /*  10000 */ [ true, 16 ],
    /*  10001 */ [ true, 17 ],
    /*  10010 */ [ true, 18 ],
    /*  10011 */ [ true, 19 ],
    /*  10100 */ [ true, 20 ],
    /*  10101 */ [ true, 21 ],
    /*  10110 */ [ true, 22 ],
    /*  10111 */ [ true, 23 ],
    /*  11000 */ [ true, 24 ],
    /*  11001 */ [ true, 25 ],
    /*  11010 */ [ true, 26 ],
    /*  11011 */ [ true, 27 ],
    /*  11100 */ [ true, 28 ],
    /*  11101 */ [ true, 29 ],
    /*  11110 */ [ true, 30 ],
    /*  11111 */ [ true, 31 ]
]));

test(/* 01000 */ 'isSuperManager', check(isSuperManager)([
    /*  00000 */ [ false, 0 ],
    /*  00001 */ [ false, 1 ],
    /*  00010 */ [ false, 2 ],
    /*  00011 */ [ false, 3 ],
    /*  00100 */ [ false, 4 ],
    /*  00101 */ [ false, 5 ],
    /*  00110 */ [ false, 6 ],
    /*  00111 */ [ false, 7 ],
    /*  01000 */ [ true, 8 ],
    /*  01001 */ [ true, 9 ],
    /*  01010 */ [ true, 10 ],
    /*  01011 */ [ true, 11 ],
    /*  01100 */ [ true, 12 ],
    /*  01101 */ [ true, 13 ],
    /*  01110 */ [ true, 14 ],
    /*  01111 */ [ true, 15 ],
    /*  10000 */ [ false, 16 ],
    /*  10001 */ [ false, 17 ],
    /*  10010 */ [ false, 18 ],
    /*  10011 */ [ false, 19 ],
    /*  10100 */ [ false, 20 ],
    /*  10101 */ [ false, 21 ],
    /*  10110 */ [ false, 22 ],
    /*  10111 */ [ false, 23 ],
    /*  11000 */ [ true, 24 ],
    /*  11001 */ [ true, 25 ],
    /*  11010 */ [ true, 26 ],
    /*  11011 */ [ true, 27 ],
    /*  11100 */ [ true, 28 ],
    /*  11101 */ [ true, 29 ],
    /*  11110 */ [ true, 30 ],
    /*  11111 */ [ true, 31 ]
]));

test(/* 00100 */ 'isCountryEditor', check(isCountryEditor)([
    /*  00000 */ [ false, 0 ],
    /*  00001 */ [ false, 1 ],
    /*  00010 */ [ false, 2 ],
    /*  00011 */ [ false, 3 ],
    /*  00100 */ [ true, 4 ],
    /*  00101 */ [ true, 5 ],
    /*  00110 */ [ true, 6 ],
    /*  00111 */ [ true, 7 ],
    /*  01000 */ [ false, 8 ],
    /*  01001 */ [ false, 9 ],
    /*  01010 */ [ false, 10 ],
    /*  01011 */ [ false, 11 ],
    /*  01100 */ [ true, 12 ],
    /*  01101 */ [ true, 13 ],
    /*  01110 */ [ true, 14 ],
    /*  01111 */ [ true, 15 ],
    /*  10000 */ [ false, 16 ],
    /*  10001 */ [ false, 17 ],
    /*  10010 */ [ false, 18 ],
    /*  10011 */ [ false, 19 ],
    /*  10100 */ [ true, 20 ],
    /*  10101 */ [ true, 21 ],
    /*  10110 */ [ true, 22 ],
    /*  10111 */ [ true, 23 ],
    /*  11000 */ [ false, 24 ],
    /*  11001 */ [ false, 25 ],
    /*  11010 */ [ false, 26 ],
    /*  11011 */ [ false, 27 ],
    /*  11100 */ [ true, 28 ],
    /*  11101 */ [ true, 29 ],
    /*  11110 */ [ true, 30 ],
    /*  11111 */ [ true, 31 ]
]));

test(/* 00010 */ 'isSuperEditor', check(isSuperEditor)([
    /*  00000 */ [ false, 0 ],
    /*  00001 */ [ false, 1 ],
    /*  00010 */ [ true, 2 ],
    /*  00011 */ [ true, 3 ],
    /*  00100 */ [ false, 4 ],
    /*  00101 */ [ false, 5 ],
    /*  00110 */ [ true, 6 ],
    /*  00111 */ [ true, 7 ],
    /*  01000 */ [ false, 8 ],
    /*  01001 */ [ false, 9 ],
    /*  01010 */ [ true, 10 ],
    /*  01011 */ [ true, 11 ],
    /*  01100 */ [ false, 12 ],
    /*  01101 */ [ false, 13 ],
    /*  01110 */ [ true, 14 ],
    /*  01111 */ [ true, 15 ],
    /*  10000 */ [ false, 16 ],
    /*  10001 */ [ false, 17 ],
    /*  10010 */ [ true, 18 ],
    /*  10011 */ [ true, 19 ],
    /*  10100 */ [ false, 20 ],
    /*  10101 */ [ false, 21 ],
    /*  10110 */ [ true, 22 ],
    /*  10111 */ [ true, 23 ],
    /*  11000 */ [ false, 24 ],
    /*  11001 */ [ false, 25 ],
    /*  11010 */ [ true, 26 ],
    /*  11011 */ [ true, 27 ],
    /*  11100 */ [ false, 28 ],
    /*  11101 */ [ false, 29 ],
    /*  11110 */ [ true, 30 ],
    /*  11111 */ [ true, 31 ]
]));

test(/* 00001 */ 'isAdmin', check(isAdmin)([
    /*  00000 */ [ false, 0 ],
    /*  00001 */ [ true, 1 ],
    /*  00010 */ [ false, 2 ],
    /*  00011 */ [ true, 3 ],
    /*  00100 */ [ false, 4 ],
    /*  00101 */ [ true, 5 ],
    /*  00110 */ [ false, 6 ],
    /*  00111 */ [ true, 7 ],
    /*  01000 */ [ false, 8 ],
    /*  01001 */ [ true, 9 ],
    /*  01010 */ [ false, 10 ],
    /*  01011 */ [ true, 11 ],
    /*  01100 */ [ false, 12 ],
    /*  01101 */ [ true, 13 ],
    /*  01110 */ [ false, 14 ],
    /*  01111 */ [ true, 15 ],
    /*  10000 */ [ false, 16 ],
    /*  10001 */ [ true, 17 ],
    /*  10010 */ [ false, 18 ],
    /*  10011 */ [ true, 19 ],
    /*  10100 */ [ false, 20 ],
    /*  10101 */ [ true, 21 ],
    /*  10110 */ [ false, 22 ],
    /*  10111 */ [ true, 23 ],
    /*  11000 */ [ false, 24 ],
    /*  11001 */ [ true, 25 ],
    /*  11010 */ [ false, 26 ],
    /*  11011 */ [ true, 27 ],
    /*  11100 */ [ false, 28 ],
    /*  11101 */ [ true, 29 ],
    /*  11110 */ [ false, 30 ],
    /*  11111 */ [ true, 31 ]
]));
