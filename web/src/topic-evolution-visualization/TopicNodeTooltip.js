import './TopicNodeTooltip.css';
import {Spinner} from "reactstrap";
import {getDetails} from "./redux";
import {connect} from "react-redux";
import ReactWordcloud from "react-wordcloud";

import {
    palette,
    TOOLTIP_ARROW,
    TOOLTIP_BORDER_RADIUS, TOOLTIP_CONTENT_SCROLLBAR_GUTTER,
    TOOLTIP_HEIGHT,
    TOOLTIP_PADDING_X, TOOLTIP_PADDING_Y,
    TOOLTIP_WIDTH
} from "./visualization/constants";
import {Link} from "react-router-dom";

const TopicNodeTooltip = props => {
    const tooltipAnchorPoint = [props.node.x + props.node.width + 1, props.node.y + Math.floor(props.node.height / 2)];
    const tooltipShape = `M ${tooltipAnchorPoint.join(' ')} l ${TOOLTIP_WIDTH - TOOLTIP_BORDER_RADIUS} 0 q ${TOOLTIP_BORDER_RADIUS} 0 ${TOOLTIP_BORDER_RADIUS} ${TOOLTIP_BORDER_RADIUS} l 0 ${TOOLTIP_HEIGHT - 8} q 0 ${TOOLTIP_BORDER_RADIUS} ${-TOOLTIP_BORDER_RADIUS} ${TOOLTIP_BORDER_RADIUS} l ${-(TOOLTIP_WIDTH - TOOLTIP_ARROW - 2 * TOOLTIP_BORDER_RADIUS)} 0 q ${-TOOLTIP_BORDER_RADIUS} 0 ${-TOOLTIP_BORDER_RADIUS} ${-TOOLTIP_BORDER_RADIUS} l 0 ${-(TOOLTIP_HEIGHT - TOOLTIP_ARROW - TOOLTIP_BORDER_RADIUS)} z`;
    if (!props.node.terms) {
        props.getDetails(props.node);
    }
    return <g className={'topic-node-tooltip'}>
        <path d={tooltipShape}>
        </path>
        <foreignObject x={tooltipAnchorPoint[0] + TOOLTIP_ARROW + TOOLTIP_PADDING_X}
                       y={tooltipAnchorPoint[1] + TOOLTIP_PADDING_Y}
                       width={TOOLTIP_WIDTH - (2 * TOOLTIP_PADDING_X) - TOOLTIP_CONTENT_SCROLLBAR_GUTTER}
                       height={TOOLTIP_HEIGHT - (2 * TOOLTIP_PADDING_Y)}>
            <div className={'container-fluid content'} xmlns="http://www.w3.org/1999/xhtml">
                <div><h3><strong><Link to={`models/${props.node.model}/topics/${props.node.topic}`} target="_blank" className={'text-decoration-none text-dark'}>{`Topic ${props.node.topic}`}</Link></strong></h3></div>
                <div><strong>&bull; Number of publications: </strong>{props.node.number_of_relevant_texts}</div>
                <div><strong>&bull; Average pagerank score: </strong>{props.node.avg_pagerank_score}</div>
                <strong>&bull; Top terms:</strong>
                <div className={'flex-grow-1'}>
                    <div
                        className={'h-100 d-flex justify-content-center align-items-center border border-secondary bg-white'}>
                        {(props.node.terms && props.node.terms.length > 0)
                            ? <div style={{width: '90%', height: '90%'}}>
                                <ReactWordcloud
                                    options={{
                                        colors: palette.getColors(),
                                        deterministic: true,
                                        enableTooltip: true,
                                        fontSizes: [5, 60],
                                        fontStyle: "normal",
                                        fontWeight: "normal",
                                        rotations: 1,
                                        rotationAngles: [0],
                                        scale: "sqrt",
                                        spiral: "archimedean",
                                        transitionDuration: 100
                                    }}
                                    words={props.node.terms}/>
                            </div>
                            : <Spinner animation="border"/>
                        }
                    </div>
                </div>
            </div>
        </foreignObject>
    </g>;
};

const mapDispatchToProps = {
    getDetails
};

export default connect(null, mapDispatchToProps)(TopicNodeTooltip);