import {useParams} from "react-router-dom";

const Topic = () => {
    const {index, model} = useParams();
    return <span>Topic view for topic {index}, of model {model}</span>;
}

export default Topic;