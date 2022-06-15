import {Provider} from "react-redux";
import './App.css';
import {Collapse, Container, Nav, Navbar, NavbarToggler, NavItem} from 'reactstrap';
import {store} from "./config/store";
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import Home from "./home/Home";
import About from "./about/About";
import React, {useState} from "react";
import Topic from "./topic/Topic";

const App = () => {
    const [isOpen,setOpen] = useState(false);
    const toggle = () => setOpen(!isOpen);
    return (
        <Provider store={store}>
            <Navbar color={'dark'} dark expand={'md'}>
                <Container>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink to={'/'} exact={true} className="nav-link">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink to={'about'} exact={true} className="nav-link">About</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Switch>
                <Route exact path={'/'} component={Home}/>
                <Route exact path={'/about'} component={About}/>
                <Route exact path={'/models/:model/topics/:index'} component={Topic}/>
                <Route path='*'>
                    <Redirect to="/" replace={true} />
                </Route>
            </Switch>
        </Provider>
    );
}

export default App;
