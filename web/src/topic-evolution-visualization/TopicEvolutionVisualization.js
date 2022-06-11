import {Button, Col, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import TopicEvolutionVisualizationLegend from "./TopicEvolutionVisualizationLegend";
import TopicEvolutionVisualizationCanvas from "./TopicEvolutionVisualizationCanvas";

const TopicEvolutionVisualization = () => {

    return <>
        <Row>
            <Col xs={12} md={8}>

            </Col>
        </Row>
        <Row className={'justify-content-center my-2'}>
            <Col xs={12} md={8}>
                <InputGroup>
                    <Input placeholder="Search topic keywords" className={'shadow-none'}/>
                    <InputGroupAddon addonType="append">
                        <Button color="dark" className={'shadow-none'}>Search</Button>
                    </InputGroupAddon>
                </InputGroup>
            </Col>
        </Row>
        <Row className={'justify-content-center m-4'}>
            <Col className={'text-scito text-center'} xs={4}>
                <h3>SCIentific TOpic trends</h3>
            </Col>
        </Row>
        <TopicEvolutionVisualizationLegend/>
        <Row className={'justify-content-center'}>
            <Col xs={12} className={'border border-secondary overflow-auto'}>
                <TopicEvolutionVisualizationCanvas width={1200} height={800}/>
            </Col>
        </Row>
    </>
}

export default TopicEvolutionVisualization;