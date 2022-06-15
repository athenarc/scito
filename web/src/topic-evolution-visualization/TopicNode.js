import {useState} from "react";
import './TopicNode.css';
import {disableTooltip, enableTooltip} from "./redux";
import {connect} from "react-redux";
import {palette} from "./visualization/constants";

const TopicNode = props => {
    const [focused, setFocused] = useState(false);
    const colorNumber = Math.floor(props.impact * 100)+31;
    const impactColor = palette.getColor(colorNumber);
    const color = focused ? palette.getColor(Math.max(colorNumber-30,1)) : impactColor;
    return (
        <g className={`topic-node ${props.filtered? 'filtered': ''} ${props.active? 'active': ''}`}>
            <rect x={props.x} y={props.y} width={props.width} height={Math.max(props.height)} fill={color}
                  onMouseEnter={() => {
                setFocused(true);
            }} onMouseLeave={() => {
                setFocused(false);
            }} onClick={()=>{
                props.active? props.disableTooltip(props.name) : props.enableTooltip(props.name);
            }} />
        </g>
    );
};

const mapDispatchToProps = {
    enableTooltip,
    disableTooltip
}

export default connect(null, mapDispatchToProps)(TopicNode);