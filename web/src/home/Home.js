import {Col, Container, Jumbotron, Row} from "reactstrap";
import TopicEvolutionVisualization from "../topic-evolution-visualization/TopicEvolutionVisualization";
import TopicFilterer from "./TopicFilterer";

const Home = () => {

    return <Container>
        <Jumbotron className={'bg-transparent pb-0'}>
            <Row className={'justify-content-center m-4'}>
                <Col xs={6} md={4}>
                    <img width={'100%'} height={'auto'} alt={'SciTo2'} src={process.env.PUBLIC_URL + '/scito2-1.png'}/>
                </Col>
            </Row>
        </Jumbotron>
        <Row className={'justify-content-center'}>
            <Col xs={12} md={8}>
                <TopicFilterer/>
            </Col>
        </Row>
        <TopicEvolutionVisualization/>
    </Container>;
}

export default Home;