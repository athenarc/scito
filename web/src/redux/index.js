import {createStore, combineReducers} from 'redux';

// Import reducers here
import topicEvolutionReducer from '../topic-evolution-visualization/redux';

const rootReducer = combineReducers(
    {
        // Register reducers here
        topicEvolution: topicEvolutionReducer
    }
)
export default createStore(rootReducer);