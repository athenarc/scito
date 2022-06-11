import {Button, ButtonGroup} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

const KeywordFilter = props => {
    const handleSwitch = () => {
        props.onSwitch(props.filter);
    }
    const handleRemove = () => {
        props.onRemove(props.filter);
    }
    const qualifiedColor = props.enabled ? 'info' : 'secondary';
    return <ButtonGroup size={'sm'}>
        <Button color={qualifiedColor} title={`${props.enabled ? 'Enable' : 'Disable'} keyword filter`}
                onClick={handleSwitch} className={'shadow-none'}>
            {props.filter}
        </Button>
        <Button color={qualifiedColor} title={'Remove keyword filter'} onClick={handleRemove} className={'shadow-none'}>
            <FontAwesomeIcon icon={faXmark}/>
        </Button>
    </ButtonGroup>
}

export default KeywordFilter;