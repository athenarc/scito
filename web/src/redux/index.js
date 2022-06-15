import {combineReducers} from 'redux';

// Import reducers here
import topicEvolutionVisualizationReducer from '../topic-evolution-visualization/redux';
import topicFiltererReducer from '../home/redux'

const rootReducer = combineReducers(
    {
        // Register reducers here
        topicEvolutionVisualization: topicEvolutionVisualizationReducer,
        topicFilterer: topicFiltererReducer
    }
);
export default rootReducer;