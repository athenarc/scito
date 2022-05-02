import {Provider} from "react-redux";
import './App.css'
import TopicEvolutionVisualization from "./topic-evolution-visualization/TopicEvolutionVisualization";
import {
    Button,
    Col,
    Collapse,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    Jumbotron,
    Nav,
    Navbar,
    NavItem,
    NavLink,
    Row
} from 'reactstrap';
import {store} from "./config/store";

const App = () => {
    return (
        <Provider store={store}>
            <Navbar color={'dark'}>
                <Container>
                    <Collapse isOpen={true} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink className="text-white" activeClassName="text-danger"
                                         href="/components/">Home</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Container>
                <Jumbotron className={'bg-transparent'}>
                    <Row className={'justify-content-center m-4'}>
                        <Col xs={6} md={4}>
                            <img width={'100%'} height={'auto'} src={process.env.PUBLIC_URL + '/scito2-1.png'}/>
                        </Col>
                    </Row>
                    <Row className={'justify-content-center'}>
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
                </Jumbotron>
                <Row className={'justify-content-center'}>
                    <Col xs={12}>
                        <TopicEvolutionVisualization width={'100%'} height={800}/>
                    </Col>
                </Row>
            </Container>
        </Provider>
    );
}

export default App;
