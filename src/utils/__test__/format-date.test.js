import test from 'ava';

import {
    formatDate
} from '..';


test(t => {
    const date = '2017-03-07';

    t.is(formatDate(date), 'Mar 7th');
});
