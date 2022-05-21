import {api} from "../../config/axios";
import {draw, normalizeLinks, normalizeNodeScores} from "../visualization";
import {FULFILLED, PENDING} from "../../utils/async-action-types";
import produce from "immer";

const ACTION_TYPES = {
    GET_DATA: 'GET_DATA',
    ENABLE_TOOLTIP: 'ENABLE_TOOLTIP',
    DISABLE_TOOLTIP: 'DISABLE_TOOLTIP',
    DRAW: 'DRAW'
};

const initialState = {
    loading: false,
    nodes: null,
    links: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PENDING(ACTION_TYPES.GET_DATA):
            return produce(initialState, draft => {
                draft.loading = true;
            });
        case ACTION_TYPES.DRAW:
        case FULFILLED(ACTION_TYPES.GET_DATA):
            const {
                nodes,
                links
            } = draw(action.payload.nodes, action.payload.links, action.payload.width, action.payload.height);
            return produce(state, draft=>{
                draft.nodes=nodes;
                draft.links=links;
            })
        case ACTION_TYPES.ENABLE_TOOLTIP:
            return produce(state, draft=> {
                const targetNode=draft.nodes.find(node=>node.name===action.nodeName)
                targetNode.active=true
            });
        case ACTION_TYPES.DISABLE_TOOLTIP:
            return produce(state, draft=> {
                const targetNode=draft.nodes.find(node=>node.name===action.nodeName)
                targetNode.active=false
            })
        default:
            return produce(state, draft => {
            });
    }
};

export const getData = (width, height) => ({
    type: ACTION_TYPES.GET_DATA,
    payload: api.get('models-similarity-graph/')
        .then(response => {
            const nodes = normalizeNodeScores(response.data.nodes);
            const links = normalizeLinks(response.data.links);
            return {
                nodes,
                links,
                width,
                height
            };
        })
});

export const enableTooltip = nodeName => (
    {
        type: ACTION_TYPES.ENABLE_TOOLTIP,
        nodeName: nodeName
    }
);

export const disableTooltip = nodeName => (
    {
        type: ACTION_TYPES.DISABLE_TOOLTIP,
        nodeName: nodeName
    }
);

export const drawData = (width, height) => ({
    type: ACTION_TYPES.DRAW
});

export default reducer;

