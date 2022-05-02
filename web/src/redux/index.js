import {combineReducers} from 'redux';

// Import reducers here
import topicEvolutionVisualizationReducer from '../topic-evolution-visualization/redux';

const rootReducer = combineReducers(
    {
        // Register reducers here
        topicEvolutionVisualization: topicEvolutionVisualizationReducer
    }
);
export default rootReducer;