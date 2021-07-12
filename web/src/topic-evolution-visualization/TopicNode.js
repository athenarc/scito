import Gradient from 'javascript-color-gradient';
import {useState} from "react";
import './TopicNode.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";

const impactColorProfile = new Gradient()
    .setGradient(
        '#1f471f',
        '#5eba5e',
        '#b8e0b8'
    )
    .setMidpoint(130);

const TopicNode = props => {
    const [focused, setFocused] = useState(false);
    const [selected, setSelected] = useState(false);
    const colorNumber = Math.floor(props.impact * 100)+31;
    const impactColor = impactColorProfile.getColor(colorNumber);
    const color = focused ? impactColorProfile.getColor(Math.max(colorNumber-30,1)) : impactColor;
    const inferTooltipShape = (x,y,width,height) => {
        const startPoint = [x+width+1, Math.floor(y+height/2)];
        return `M ${startPoint.join(' ')} l 130 0 l 0 80 l -110 0 l 0 -60 l -20 -20`;
    }
    return (
        <g className={'topic-node'}>
            <rect x={props.x} y={props.y} width={props.width} height={Math.max(props.height)} fill={color}
                  onMouseEnter={() => {
                setFocused(true);
            }} onMouseLeave={() => {
                setFocused(false);
            }} onClick={()=>{
                setSelected(!selected);
            }} />
            {
                selected &&
                <g className={`topic-tooltip ${selected? 'd-block': 'd-none'}`}>
                    <path d={inferTooltipShape(props.x, props.y, props.width, props.height)}>
                    </path>
                    <foreignObject x={props.x+245} y={props.y+245} width="160" height="160">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed mollis mollis mi ut ultricies. Nullam magna ipsum,
                            porta vel dui convallis, rutrum imperdiet eros. Aliquam
                            erat volutpat.
                        </div>
                    </foreignObject>
                    {/*<text x={props.x+props.width+26} y={props.y+Math.floor(props.height/2)+10}>Topic 43</text>*/}
                    {/*<text x={props.x+props.width+26} y={props.y+Math.floor(props.height/2)+30} className={'heavy'}>*/}
                    {/*    <FontAwesomeIcon icon={faFire}/>*/}
                    {/*</text>*/}
                </g>
            }
        </g>
    );
};

export default TopicNode;