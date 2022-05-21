import {Col, Row} from "reactstrap";
import './TopicEvolutionVisualizationLegend.css';

const TopicEvolutionVisualizationLegend = props => {
    return <Row>
        <Col xs={12} sm={6} className={'border border-secondary'}>
            <div className="d-flex justify-content-center align-items-center">
                <div className={'d-flex justify-content-end align-items-center'}>
                    <span>Less publications</span>
                    <svg width={20} height={20}>
                        <rect x={7} y={5} width={6} height={10} fill={'#5eba5e'}/>
                    </svg>
                </div>
                <span className={'legend-arrow'}/>
                <div className={'d-flex justify-content-start align-items-center'}>
                    <svg width={20} height={20}>
                        <rect x={7} y={1} width={6} height={18} fill={'#5eba5e'}/>
                    </svg>
                    <span>More publications</span>
                </div>
            </div>
        </Col>
        <Col xs={12} sm={6} className={'border border-secondary'}>
            <div className="d-flex justify-content-center align-items-center">
                <div className={'d-flex justify-content-end align-items-center'}>
                    <span>Less influence</span>
                    <svg width={20} height={20}>
                        <rect x={7} y={3} width={6} height={14} fill={'#5eba5e'}/>
                    </svg>
                </div>
                <span className={'legend-arrow'}/>
                <div className={'d-flex justify-content-start align-items-center'}>
                    <svg width={20} height={20}>
                        <rect x={7} y={3} width={6} height={14} fill={'#1f471f'}/>
                    </svg>
                    <span>More influence</span>
                </div>
            </div>
        </Col>
    </Row>;
};

export default TopicEvolutionVisualizationLegend;