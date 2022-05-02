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
            return {
                ...state,
                loading: true
            }
        case ACTION_TYPES.DRAW:
        case FULFILLED(ACTION_TYPES.GET_DATA):
            const {nodes, links} = draw(action.payload.nodes, action.payload.links, action.payload.width, action.payload.height)
            return {
                ...state,
                nodes,
                links,
                loading: false
            }
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
            return {
                ...state
            }
    }
};

export const getData = (width, height) => ({
    type: ACTION_TYPES.GET_DATA,
    payload: api.get('models-similarity-graph/')
        .then(response => {
            // const {nodes, links} = response.data;
            // console.log('data came');
            // console.log(data);
            //
            // // const avg_pagerank_scores = data.nodes.reduce((total_avg_pr, current) => total_avg_pr + (Math.log(current.avg_pagerank_score) / Math.log(.000002)), 0.0)
            // const avg_pagerank_scores = data.nodes.map(topicNode => -Math.log(topicNode.avg_pagerank_score));
            // const min_avg_pagerank_score = Math.min(...avg_pagerank_scores)
            // const range_pagerank_scores = Math.max(...avg_pagerank_scores) - min_avg_pagerank_score;
            // data.nodes = data.nodes.map(topicNode => {
            //         const layer = topicNode.model;
            //         const log_avg_pagerank_score = -Math.log(topicNode.avg_pagerank_score);
            //         const proportional_avg_pagerank_score = (log_avg_pagerank_score - min_avg_pagerank_score) / range_pagerank_scores;
            //         return {
            //             ...topicNode,
            //             layer,
            //             proportional_avg_pagerank_score
            //         }
            //     }
            // );
            const nodes=normalizeNodeScores(response.data.nodes);
            // data.links = data.links.map(topicLink => ({
            //     ...topicLink,
            //     source: topicLink.topic0,
            //     target: topicLink.topic1
            // }));
            const links=normalizeLinks(response.data.links);
            return {
                nodes,
                links,
                width,
                height
            }
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
})

export default reducer;

