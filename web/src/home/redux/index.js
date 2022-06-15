import produce from "immer";
import {api} from "../../config/axios";
import {FULFILLED} from "../../utils/async-action-types";
import {topicHash} from "../../utils/data-context";

const ACTION_TYPES = {
    ADD_FILTER: 'ADD_FILTER',
    SWITCH_FILTER: 'SWITCH_FILTER',
    REMOVE_FILTER: 'REMOVE_FILTER',
    CLEAR_FILTERS: 'CLEAR_FILTERS'
}

const initialState = {
    filters: {},
    filterEffectCache: {},
    filteredTopics: []
}

const evaluateFilteredTopicsConjunction = (filters, filterEffects) => {
    let base = {};
    let intersection = {};
    filters.forEach((filter, idx) => {
        if (Object.keys(base).length === 0) {
            if (idx===0) {
                base = filterEffects[filter].reduce((matchingTopics, topic) => {
                    return {...matchingTopics, [topicHash(topic)]: topicHash(topic)}
                    // return produce(matchingTopics, draft => {draft[topicHash(topic)] = topic});
                }, {})
            }
            else {
                return base;
            }
        } else {
            filterEffects[filter].forEach(topic => {
                const currentTopicHash = topicHash(topic);
                if (base.hasOwnProperty(currentTopicHash)) {
                    intersection[currentTopicHash] = currentTopicHash;
                }
            })
            base = intersection;
            intersection = {};
        }
    })
    return base;
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FULFILLED(ACTION_TYPES.ADD_FILTER):
            state = produce(state, draft => {
                draft.filterEffectCache[action.payload.filter]=action.payload.data;
            })
        case ACTION_TYPES.ADD_FILTER:
            return produce(state, draft => {
                if (!draft.filters.hasOwnProperty(action.payload.filter)) {
                    draft.filters[action.payload.filter] = true;
                }
                draft.filteredTopics = Object.values(evaluateFilteredTopicsConjunction(Object.keys(draft.filters).filter(filter=>draft.filters[filter]), draft.filterEffectCache));
            });
        case ACTION_TYPES.SWITCH_FILTER:
            return produce(state, draft => {
                if (draft.filters.hasOwnProperty(action.payload)) draft.filters[action.payload] = !draft.filters[action.payload];
                draft.filteredTopics = Object.values(evaluateFilteredTopicsConjunction(Object.keys(draft.filters).filter(filter=>draft.filters[filter]), draft.filterEffectCache));
            })
        case ACTION_TYPES.REMOVE_FILTER:
            return produce(state, draft => {
                if (draft.filters.hasOwnProperty(action.payload)) delete draft.filters[action.payload];
                draft.filteredTopics = Object.values(evaluateFilteredTopicsConjunction(Object.keys(draft.filters).filter(filter=>draft.filters[filter]), draft.filterEffectCache));
            });
        case ACTION_TYPES.CLEAR_FILTERS:
            return produce(initialState, ()=>{});
        default:
            return state;
    }
}


export const addFilter = filter => (dispatch, getState) => {
    const {filterEffectCache} = getState().topicFilterer;
    console.log(getState());
    const payload = {
        filter
    }
    if (!filterEffectCache.hasOwnProperty(filter)) {
        dispatch({
            type: ACTION_TYPES.ADD_FILTER,
            payload: api.get('search-topics', {params: {token: filter}})
                .then(response => {
                    const {data} = response;
                    payload['data'] = data;
                    return payload;
                })
        });
    }
    else {
        dispatch({
            type: ACTION_TYPES.ADD_FILTER,
            payload
        })
    }
}

export const switchFilter = filter => ({
    type: ACTION_TYPES.SWITCH_FILTER,
    payload: filter
})

export const removeFilter = filter => ({
    type: ACTION_TYPES.REMOVE_FILTER,
    payload: filter
})

export const clearFilters = () => ({
    type: ACTION_TYPES.CLEAR_FILTERS
})

export default reducer;