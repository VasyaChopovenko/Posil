import Container from "react-bootstrap/Container";
import {Button, Form, FormControl, Nav, Navbar} from "react-bootstrap";
import React from "react";

export default function NavBar() {
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                {/*<Navbar.Brand className="fw-bold m-auto">Posil</Navbar.Brand>*/}
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav
                        className="my-2 my-lg-0 me-auto fs-4"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <Nav.Link href="/cart" className="cursor-pointer"><i className="bi bi-cart"/> Кошик</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
