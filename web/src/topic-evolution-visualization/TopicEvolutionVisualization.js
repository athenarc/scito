import data from './dummy-dataset-scito.json';
import {useEffect, useState} from "react";
import {EvolutionGraph} from "@deligianp/evolution-graph";
import TopicNode from "./TopicNode";
import TopicRelationshipPath from "./TopicRelationshipPath";
import axios from 'axios';

const TopicEvolutionVisualization = props => {
	const [dataLayout, setDataLayout] = useState(null);
	const retrieveData = () => {
		axios.get('http://localhost:8000/api/models-similarity-graph')
			.then(response => {
				const data = response.data;

				// const avg_pagerank_scores = data.nodes.reduce((total_avg_pr, current) => total_avg_pr + (Math.log(current.avg_pagerank_score) / Math.log(.000002)), 0.0)
				const avg_pagerank_scores = data.nodes.map(topicNode => - Math.log(topicNode.avg_pagerank_score));
				const min_avg_pagerank_score = Math.min(...avg_pagerank_scores)
				const range_pagerank_scores = Math.max(...avg_pagerank_scores)-min_avg_pagerank_score;
				data.nodes = data.nodes.map(topicNode => {
						const layer = topicNode.model;
						// const log_avg_pagerank_score = (Math.log(topicNode.avg_pagerank_score) / Math.log(.000002));
						const log_avg_pagerank_score = - Math.log(topicNode.avg_pagerank_score);
						const proportional_avg_pagerank_score = (log_avg_pagerank_score-min_avg_pagerank_score) / range_pagerank_scores;
						return {
							...topicNode,
							layer,
							proportional_avg_pagerank_score
						}
					}
				)
				data.links = data.links.map(topicLink => ({
					...topicLink,
					source: topicLink.topic0,
					target: topicLink.topic1
				}))
				console.log(data);

				const eg = new EvolutionGraph(props.width, props.height);
				eg.loadData(data);
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
				setDataLayout(eg.getLayout());
			})
		// const eg = new EvolutionGraph(props.width, props.height);
		// eg.loadData(data);
		// eg.loadOptions(
		// 	{
		// 		rendering: {
		// 			linkType: 'c_bezier',
		// 			nodeMargin: 2,
		// 			layerMargin: 200
		// 		},
		// 		data: {
		// 			weighted: true,
		// 			weightAttributeName: 'related_papers'
		// 		}
		// 	}
		// );
		// setDataLayout(eg.getLayout());
	}


	useEffect(retrieveData, []);
	return (
		<svg width={props.width} height={props.height}>
			{dataLayout && dataLayout.links.map(
				link => <TopicRelationshipPath
					start={link.start}
					controlPoint0={link.controlPoint0}
					controlPoint1={link.controlPoint1}
					end={link.end}
				/>
			)}
			{dataLayout && dataLayout.nodes.map(
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
	);
};


export default TopicEvolutionVisualization;