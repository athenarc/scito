import './TopicRelationshipPath.css'

const TopicRelationshipPath = props => {
    const startPathRepresentation = props.start.join(' ');
    const additionalPathRepresentation = `C ${props.controlPoint0.join(' ')} ${props.controlPoint1.join(' ')} `;
    const endPathRepresenetation = props.end.join(' ');
    const linePathRepresentation = `M ${startPathRepresentation} ${additionalPathRepresentation} ${endPathRepresenetation}`;
    return (
        <g className={'topic-relationship-path'}>
            <path d={linePathRepresentation}/>
        </g>
    );
};

export default TopicRelationshipPath;