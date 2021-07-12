const ACTION_TYPES = {
    SET_DATA: 'SET_DATA',
    CLEAR: 'CLEAR'
};

const initialState = {
    nodes: null,
    links: null
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_DATA:
            return {
                ...state,
                nodes: action.payload.nodes,
                links: action.payload.links
            }
        case ACTION_TYPES.CLEAR:
            return {
                ...state,
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
};

export const setData = data => (
    {
        type: ACTION_TYPES.SET_DATA,
        payload: {
            nodes: data.nodes,
            links: data.links
        }
    }
);

export const clear = () => (
    {
        type: ACTION_TYPES.CLEAR,
    }
);

export default reducer;

