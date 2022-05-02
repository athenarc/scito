// import data from './dummy-dataset-scito.json';
import {useEffect, useState} from "react";
import {EvolutionGraph} from "@deligianp/evolution-graph";
import TopicNode from "./TopicNode";
import TopicRelationshipPath from "./TopicRelationshipPath";
import axios from 'axios';
import {getData, enableTooltip, disableTooltip, drawData} from "./redux";
import {api} from "../config/axios";
import {connect} from "react-redux";
import React from "react";

class TopicEvolutionVisualization extends React.Component {
    componentDidMount() {
        this.props.getData(this.props.width, this.props.height);
    }

    render() {
        return <svg width={this.props.width} height={this.props.height}>
            {this.props.links && this.props.links.map(
                link => <TopicRelationshipPath
                    start={link.start}
                    controlPoint0={link.controlPoint0}
                    controlPoint1={link.controlPoint1}
                    end={link.end}
                />
            )}
            {this.props.nodes && this.props.nodes.map(
                node => <TopicNode
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    impact={node.proportional_avg_pagerank_score}
                    key={`node-${node.name}`}
                />
            )}
        </svg>
    }
};

const mapStateToProps = storeState => ({
    nodes: storeState.topicEvolutionVisualization.nodes,
    links: storeState.topicEvolutionVisualization.links,
    loading: storeState.topicEvolutionVisualization.loading
})

const mapDispatchToProps = {
    getData,
    drawData
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicEvolutionVisualization);