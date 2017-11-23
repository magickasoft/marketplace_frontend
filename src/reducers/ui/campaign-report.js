import {
    isEmpty
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    RESET,
    RECEIVE_CAMPAIGN_START,
    RECEIVE_CAMPAIGN_FAILURE,
    RECEIVE_CAMPAIGN_SUCCESS,
    RECEIVE_SUMMARY_START,
    RECEIVE_SUMMARY_FAILURE,
    RECEIVE_SUMMARY_SUCCESS,
    RECEIVE_CHART_START,
    RECEIVE_CHART_FAILURE,
    RECEIVE_CHART_SUCCESS
} from 'actions/ui/campaign-report';


export const initialState = {
    bunch: Nothing(),
    interval: [ Nothing(), Nothing() ],
    discretization: Nothing(),
    campaign: {
        busy: false,
        errors: Nothing()
    },
    summary: {
        results: Nothing(),
        busy: false,
        errors: Nothing()
    },
    chart: {
        results: Nothing(),
        busy: false,
        errors: Nothing()
    }
};

export function reducer(state, action) {
    switch (action.type) {
        case RESET: {
            return initialState;
        }

        case RECEIVE_CAMPAIGN_START: {
            return {
                ...state,
                bunch: Just(action.payload),
                campaign: {
                    ...state.campaign,
                    busy: true
                }
            };
        }

        case RECEIVE_CAMPAIGN_FAILURE: {
            return {
                ...state,
                campaign: {
                    ...state.campaign,
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_CAMPAIGN_SUCCESS: {
            return {
                ...state,
                campaign: {
                    ...state.campaign,
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        case RECEIVE_SUMMARY_START: {
            return {
                ...state,
                bunch: Just(action.payload),
                summary: {
                    ...state.summary,
                    busy: true
                }
            };
        }

        case RECEIVE_SUMMARY_FAILURE: {
            return {
                ...state,
                summary: {
                    ...state.summary,
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_SUMMARY_SUCCESS: {
            return {
                ...state,
                summary: {
                    ...state.summary,
                    results: Just(action.payload),
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        case RECEIVE_CHART_START: {
            const [ start, end ] = action.payload.interval;

            return {
                ...state,
                bunch: Just(action.payload.bunch),
                interval: [ Just(start), Just(end) ],
                discretization: Just(action.payload.discretization),
                chart: {
                    ...state.chart,
                    busy: true
                }
            };
        }

        case RECEIVE_CHART_FAILURE: {
            return {
                ...state,
                chart: {
                    ...state.chart,
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_CHART_SUCCESS: {
            return {
                ...state,
                chart: {
                    ...state.chart,
                    results: isEmpty(action.payload) ?
                        Nothing() :
                        Just(action.payload),
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        default: {
            return state;
        }
    }
}
