import {
    initialState as initialUIState,
    reducer as reducerUI
} from './ui';
import {
    initialState as initialDataState,
    reducer as reducerData
} from './data';
import {
    initialState as initialSessionState,
    reducer as reducerSession
} from './session';
import {
    initialState as initialRoutingState,
    reducer as reducerRouting
} from './routing';

export const initialState = {
    ui: initialUIState,
    data: initialDataState,
    session: initialSessionState,
    routing: initialRoutingState
};

export function reducer(state, action) {
    const nextUI = reducerUI(state.ui, action);
    const nextData = reducerData(state.data, action);
    const nextSession = reducerSession(state.session, action);
    const nextRouting = reducerRouting(state.routing, action);

    if (
        state.ui === nextUI &&
        state.data === nextData &&
        state.session === nextSession &&
        state.routing === nextRouting
    ) {
        return state;
    }

    return {
        ui: nextUI,
        data: nextData,
        session: nextSession,
        routing: nextRouting
    };
}
