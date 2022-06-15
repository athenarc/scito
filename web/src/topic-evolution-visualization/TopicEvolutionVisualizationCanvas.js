import React from "react";
import TopicNode from "./TopicNode";
import TopicRelationshipPath from "./TopicRelationshipPath";
import {drawData, getData} from "./redux";
import {connect} from "react-redux";
import TopicNodeTooltip from "./TopicNodeTooltip";

class TopicEvolutionVisualizationCanvas extends React.Component {
    componentDidMount() {
        this.props.getData(this.props.width, this.props.height);
    }

    render() {
        const modelHeadings = {};
        if (this.props.nodes) {
            Object.values(this.props.nodes).forEach(node => {
                if (!(modelHeadings.hasOwnProperty(node.model))) {
                    modelHeadings[node.model] = [node.x, 25, node.model_title];
                }
            });
        }

        const topicNodeTooltips = [];
        if (this.props.activeNodesRegistry && Object.keys(this.props.activeNodesRegistry).length > 0) {
            Object.entries(this.props.activeNodesRegistry).forEach(([nodeName, renderOrder]) => {
                const node = this.props.nodes[nodeName];
                topicNodeTooltips[renderOrder]=<TopicNodeTooltip
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    numberOfDocuments={node.number_of_relevant_texts}
                    score={node.avg_pagerank_score}
                    node={node}
                    key={`node-tooltip-${node.name}`}
                />;
            });
        }
        return <svg width={this.props.width + 400} height={this.props.height + 400}>
            {Object.keys(modelHeadings).length > 0 && Object.keys(modelHeadings).map(model => {
                const modelHeading = modelHeadings[model];
                return <text key={`heading-${modelHeading[2]}`} textAnchor={'middle'} dominantBaseline={'middle'}
                             x={modelHeading[0]} y={modelHeading[1]}>
                    {modelHeading[2]}
                </text>;
            })}
            {this.props.links && Object.values(this.props.links).map(
                link => <TopicRelationshipPath
                    start={link.start}
                    controlPoint0={link.controlPoint0}
                    controlPoint1={link.controlPoint1}
                    end={link.end}
                    key={`link-${link.topic0}-${link.topic1}`}
                />
            )}
            {this.props.nodes && Object.values(this.props.nodes).map(
                node => <TopicNode
                        x={node.x}
                        y={node.y}
                        width={node.width}
                        height={node.height}
                        impact={node.proportional_avg_pagerank_score}
                        key={`node-${node.name}`}
                        name={node.name}
                        filtered={this.props.filteredTopics.includes(node.name)}
                        active={this.props.activeNodesRegistry.hasOwnProperty(node.name)}
                    />
            )}

            {topicNodeTooltips}
        </svg>;
    }
}

const mapStateToProps = storeState => ({
    nodes: storeState.topicEvolutionVisualization.nodes,
    links: storeState.topicEvolutionVisualization.links,
    loading: storeState.topicEvolutionVisualization.loading,
    activeNodesRegistry: storeState.topicEvolutionVisualization.activeNodesRegistry,
    filteredTopics: storeState.topicFilterer.filteredTopics
});

const mapDispatchToProps = {
    getData,
    drawData
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicEvolutionVisualizationCanvas);