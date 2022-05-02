import {EvolutionGraph} from "@deligianp/evolution-graph";

export const normalizeNodeScores = nodes => {
    const avg_pagerank_scores = nodes.map(topicNode => -Math.log(topicNode.avg_pagerank_score));
    const min_avg_pagerank_score = Math.min(...avg_pagerank_scores)
    const range_pagerank_scores = Math.max(...avg_pagerank_scores) - min_avg_pagerank_score;
    return nodes.map(topicNode => {
            const layer = topicNode.model;
            const log_avg_pagerank_score = -Math.log(topicNode.avg_pagerank_score);
            const proportional_avg_pagerank_score = (log_avg_pagerank_score - min_avg_pagerank_score) / range_pagerank_scores;
            return {
                ...topicNode,
                layer,
                proportional_avg_pagerank_score
            }
        }
    );
}

export const normalizeLinks = links => {
    return links.map(topicLink => ({
        ...topicLink,
        source: topicLink.topic0,
        target: topicLink.topic1
    }));
}

export const draw = (nodes, links, width, height) => {
    const eg = new EvolutionGraph(width, height);
    eg.loadData({nodes, links});
    eg.loadOptions(
        {
            rendering: {
                linkType: 'c_bezier',
                nodeMargin: 2,
                layerMargin: 200
            },
            data: {
                weighted: true,
                weightAttributeName: 'number_of_relevant_texts'
            }
        }
    );
    const layout = eg.getLayout();
    return layout;
}