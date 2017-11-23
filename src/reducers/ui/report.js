import {
    Nothing,
    Just
} from 'data.maybe';
import {
    RECEIVE_CHART_START,
    RECEIVE_TABLE_START,
    RECEIVE_CHART_SUCCESS,
    RECEIVE_TABLE_SUCCESS,
    RECEIVE_CHART_FAILURE,
    RECEIVE_TABLE_FAILURE
} from 'actions/ui/report';

export const initialState = {
    interval: [ Nothing(), Nothing() ],
    page: Nothing(),
    sort: [ Nothing(), Nothing() ],
    discretization: Nothing(),
    chart: {
        results: Nothing(),
        busy: false,
        errors: Nothing()
    },
    table: {
        total: Nothing(),
        results: Nothing(),
        busy: false,
        errors: Nothing()
    }
};

export function reducer(state, action) {
    switch (action.type) {
        case RECEIVE_CHART_START: {
            const [ start, end ] = action.payload.interval;

            return {
                ...state,
                interval: [ Just(start), Just(end) ],
                discretization: Just(action.payload.discretization),
                chart: {
                    ...state.chart,
                    busy: true
                }
            };
        }

        case RECEIVE_CHART_SUCCESS: {
            return {
                ...state,
                chart: {
                    ...state.chart,
                    results: Just(action.payload),
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        case RECEIVE_CHART_FAILURE: {
            return {
                ...state,
                chart: {
                    ...state.chart,
                    results: Nothing(),
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_TABLE_START: {
            const [ start, end ] = action.payload.interval;
            const [ ordering, field ] = action.payload.sort;

            return {
                ...state,
                interval: [ Just(start), Just(end) ],
                sort: [ Just(ordering), Just(field) ],
                page: Just(action.payload.page),
                table: {
                    ...state.table,
                    busy: true
                }
            };
        }

        case RECEIVE_TABLE_SUCCESS: {
            return {
                ...state,
                table: {
                    ...state.table,
                    total: Just(action.payload.total),
                    results: Just(action.payload.results),
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        case RECEIVE_TABLE_FAILURE: {
            return {
                ...state,
                table: {
                    ...state.table,
                    results: Nothing(),
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        default: {
            return state;
        }
    }
}
