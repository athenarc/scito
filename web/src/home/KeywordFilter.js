import {Button, ButtonGroup} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {removeFilter, switchFilter} from "./redux";
import {connect} from "react-redux";

const KeywordFilter = props => {
    const handleSwitch = () => {
        props.switchFilter(props.filter);
    }
    const handleRemove = () => {
        props.removeFilter(props.filter);
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

const mapDispatchToProps = {
    switchFilter,
    removeFilter
}

export default connect(null, mapDispatchToProps)(KeywordFilter);