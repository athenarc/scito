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
    links: null,
    activeNodesRegistry: null
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
            return produce(state, draft => {
                const nodesRegistry = {};
                const linksRegistry = {};
                nodes.forEach(node=>{
                    nodesRegistry[node.name]=node;
                });
                draft.nodes =nodesRegistry;
                // draft.nodes = nodes.reduce((registry, node) => registry[node.name] = node, {});
                links.forEach(link=>{
                    linksRegistry[`link-${link.topic0}-${link.topic1}`] = link;
                });
                // draft.links = links.reduce((registry, link) => registry[`link-${link.topic0.name}-${link.topic1.name}`] = link, {});
                draft.links = linksRegistry;
                draft.activeNodesRegistry = {};
                draft.loading = false;
            });
        case ACTION_TYPES.ENABLE_TOOLTIP:
            return produce(state, draft => {
                draft.activeNodesRegistry[action.nodeName]=Object.keys(draft.activeNodesRegistry).length;
            });
        case ACTION_TYPES.DISABLE_TOOLTIP:
            return produce(state, draft => {
                if (draft.activeNodesRegistry.hasOwnProperty(action.nodeName)) {
                    const order = draft.activeNodesRegistry[action.nodeName];
                    Object.keys(draft.activeNodesRegistry).forEach(nodeName=>{
                        if (draft.activeNodesRegistry[nodeName]>order) {
                            draft.activeNodesRegistry[nodeName]-=1;
                        }
                    });
                    delete draft.activeNodesRegistry[action.nodeName];
                }
            });
        case PENDING(ACTION_TYPES.GET_DETAILS):
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

