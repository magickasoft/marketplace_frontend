import test from 'ava';
import {
    uniqueId,
    reduce
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    initialState,
    reducer,
    __RewireAPI__
} from '../campaign';


const CHANGE_NAME = uniqueId('action');
const CHANGE_DESCRIPTION = uniqueId('action');
const CHANGE_START_DATE = uniqueId('action');
const CHANGE_END_DATE = uniqueId('action');
const CREATE_CAMPAIGN_START = uniqueId('action');
const CREATE_CAMPAIGN_SUCCESS = uniqueId('action');
const CREATE_CAMPAIGN_FAILURE = uniqueId('action');
const UPDATE_CAMPAIGN_START = uniqueId('action');
const UPDATE_CAMPAIGN_SUCCESS = uniqueId('action');
const UPDATE_CAMPAIGN_FAILURE = uniqueId('action');

test.before(() => {
    __RewireAPI__.__set__({
        CHANGE_NAME,
        CHANGE_DESCRIPTION,
        CHANGE_START_DATE,
        CHANGE_END_DATE,
        CREATE_CAMPAIGN_START,
        CREATE_CAMPAIGN_SUCCESS,
        CREATE_CAMPAIGN_FAILURE,
        UPDATE_CAMPAIGN_START,
        UPDATE_CAMPAIGN_SUCCESS,
        UPDATE_CAMPAIGN_FAILURE
    });
});

test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('CHANGE_NAME', t => {
    const action1 = {
        type: CHANGE_NAME,
        payload: uniqueId('value')
    };
    const state0 = {
        bunch: Nothing(),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description')
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: {
            name: action1.payload,
            description: state0.fields.description
        },
        busy: state0.busy,
        errors: Just({
            name: Nothing(),
            description: state0.errors.get().description,
            common: Nothing()
        })
    });
});

test('CHANGE_DESCRIPTION', t => {
    const action1 = {
        type: CHANGE_DESCRIPTION,
        payload: uniqueId('value')
    };
    const state0 = {
        bunch: Nothing(),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description')
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: {
            name: state0.fields.name,
            description: action1.payload
        },
        busy: state0.busy,
        errors: Just({
            name: state0.errors.get().name,
            description: Nothing(),
            common: Nothing()
        })
    });
});

test('CHANGE_START_DATE', t => {
    const action1 = {
        type: CHANGE_START_DATE,
        payload: uniqueId('value')
    };
    const state0 = {
        bunch: Nothing(),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description'),
            startDate: uniqueId('startDate'),
            endDate: Nothing()
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            startDate: Just(uniqueId('errors')),
            endDate: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: {
            name: state0.fields.name,
            description: state0.fields.description,
            startDate: action1.payload,
            endDate: state0.fields.endDate
        },
        busy: state0.busy,
        errors: Just({
            name: state0.errors.get().name,
            description: state0.errors.get().description,
            startDate: Nothing(),
            endDate: state0.errors.get().endDate,
            common: Nothing()
        })
    });
});

test('CHANGE_END_DATE', t => {
    const action1 = {
        type: CHANGE_END_DATE,
        payload: uniqueId('value')
    };
    const action2 = {
        type: CHANGE_END_DATE,
        payload: ''
    };
    const state0 = {
        bunch: Nothing(),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description'),
            startDate: uniqueId('startDate'),
            endDate: Nothing()
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            startDate: Just(uniqueId('errors')),
            endDate: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: {
            name: state0.fields.name,
            description: state0.fields.description,
            startDate: state0.fields.startDate,
            endDate: Just(action1.payload)
        },
        busy: state0.busy,
        errors: Just({
            name: state0.errors.get().name,
            description: state0.errors.get().description,
            startDate: state0.errors.get().startDate,
            endDate: Nothing(),
            common: Nothing()
        })
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        bunch: state1.bunch,
        fields: {
            name: state1.fields.name,
            description: state1.fields.description,
            startDate: state1.fields.startDate,
            endDate: Nothing()
        },
        busy: state1.busy,
        errors: Just({
            name: state1.errors.get().name,
            description: state1.errors.get().description,
            startDate: state1.errors.get().startDate,
            endDate: Nothing(),
            common: Nothing()
        })
    });
});

test('CREATE_CAMPAIGN_*', t => {
    const action1 = {
        type: CREATE_CAMPAIGN_START
    };
    const action2 = {
        type: CREATE_CAMPAIGN_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: CREATE_CAMPAIGN_SUCCESS,
        payload: uniqueId('bunch')
    };
    const state0 = {
        bunch: Nothing(),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description')
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: state0.fields,
        busy: true,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        bunch: state1.bunch,
        fields: state1.fields,
        busy: false,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        bunch: state3.bunch,
        fields: state3.fields,
        busy: true,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        bunch: Just(action3.payload),
        fields: state3.fields,
        busy: false,
        errors: Nothing()
    });
});

test('UPDATE_CAMPAIGN_*', t => {
    const action1 = {
        type: UPDATE_CAMPAIGN_START
    };
    const action2 = {
        type: UPDATE_CAMPAIGN_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: UPDATE_CAMPAIGN_SUCCESS
    };
    const state0 = {
        bunch: Just(uniqueId('bunch')),
        fields: {
            name: uniqueId('name'),
            description: uniqueId('description')
        },
        busy: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        bunch: state0.bunch,
        fields: state0.fields,
        busy: true,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        bunch: state1.bunch,
        fields: state1.fields,
        busy: false,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        bunch: state3.bunch,
        fields: state3.fields,
        busy: true,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        bunch: state3.bunch,
        fields: state3.fields,
        busy: false,
        errors: Nothing()
    });
});
