import {Fragment, useRef, useState} from "react";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {api} from "../config/axios";
import {Col, Row} from "reactstrap";
import KeywordFilter from "./KeywordFilter";
import {addFilter, clearFilters} from "./redux";
import {connect} from "react-redux";

const TopicFilterer = props => {
    const ref = useRef(null);
    const controller = new AbortController()

    const [isLoading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    // const [filters, setFilters] = useState({});
    const handleSearch = query => {
        if (isLoading) controller.abort();
        else setLoading(true);
        api.get(`search-terms`, {
            params: {
                token: query
            },
            signal: controller.signal
        })
            .then(response => {
                const matchedTerms = response.data;
                setOptions(matchedTerms);
                setLoading(false);
            })
            .catch(reason => {
                setLoading(false)
            })
    }

    // const addFilter = selection => {
    //     setFilters(produce(filters, draft => {
    //         draft[selection] = true
    //     }));
    // }
    // const removeFilter = selection => {
    //     setFilters(produce(filters, draft => {
    //         if (draft.hasOwnProperty(selection)) delete draft[selection];
    //     }));
    // }
    // const switchFilter = selection => {
    //     setFilters(produce(filters, draft => {
    //         if (draft.hasOwnProperty(selection)) draft[selection] = !draft[selection];
    //     }));
    // }
    //
    // const clearFilters = () => setFilters({});

    const handleChange = selections => {
        if (selections.length > 0) {
            props.addFilter(selections[0]);
            ref.current.clear();
        }
    }

    // Ideally wanted to use as filter but takes too long and creates rendering issues
    // const filterOutSelected = matchedTerm => Object.keys(filters).find(filter=>filter===matchedTerm) === undefined;

    const renderMatch = (option, props, index) => {
        const {text} = props;
        const token = text.toLowerCase();
        const indexOfMatch = option.indexOf(token);
        return <Fragment>
            <span>{option.substring(0, indexOfMatch)}</span>
            <span className={'text-info'}>{token}</span>
            {(indexOfMatch + token.length < option.length) &&
                <span>{option.substring(indexOfMatch + token.length)}</span>
            }
        </Fragment>;
    }

    return <Fragment>
        <Row>
            <Col>
                <AsyncTypeahead
                    id="topic-term-filter-input"
                    isLoading={isLoading}
                    labelKey="term"
                    minLength={3}
                    onBlur={evt => ref.current.clear()}
                    onChange={handleChange}
                    onSearch={handleSearch}
                    options={options}
                    placeholder="Filter by topic keywords..."
                    ref={ref}
                    renderMenuItemChildren={renderMatch}
                    useCache={true}
                />
            </Col>
        </Row>
        <Row className={'my-2 justify-content-center'}>
            <Col xs={12}>
                {Object.keys(props.filters).length > 0 &&
                    <div className={'ml-3 d-flex align-items-baseline'}>
                        <div style={{flex: '0 0 content'}}>
                            <div>Topic keywords (<a onClick={props.clearFilters} role={'button'} className={'text-danger'}>clear</a>):</div>
                        </div>
                        <div className={'d-flex flex-row flex-wrap'}>
                            {Object.keys(props.filters).map(filter => {
                                return <div key={`filter-${filter}`} className={'d-inline-block m-1'}>
                                    <KeywordFilter
                                        enabled={props.filters[filter]}
                                        filter={filter}
                                    />
                                </div>
                            })
                            }
                        </div>
                    </div>
                }
            </Col>
        </Row>
    </Fragment>
}

const mapStateToProps = storeState => ({
    filters: storeState.topicFilterer.filters,
    filteredTopics: storeState.topicFilterer.filteredTopics
});

const mapDispatchToProps = {
    addFilter, clearFilters
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicFilterer);