import Container from "react-bootstrap/Container";
import {Button, Form, FormControl, Nav, Navbar} from "react-bootstrap";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectAllCartItems} from "../features/cart/cartSlice"
import "./NavBar.css";
import {setFilterValue} from "../features/products/productsSlice";

export default function NavBar() {
    const cartItems = useSelector(selectAllCartItems);
    const cartItemsCount = cartItems.length;
    const totalPrice = useSelector(state => state.cart.totalPrice);

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                {/*<Navbar.Brand className="fw-bold m-auto">Posil</Navbar.Brand>*/}
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav
                        className="my-2 my-lg-0 fs-4"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <Nav.Link href="/products/add" className="p-0 text-white rounded me-1">
                            <Button variant="outline-primary" className="fs-5">Додати продукт</Button>
                        </Nav.Link>
                        <Nav.Link href="/cart" bg="primary" className="p-0 bg-primary text-white rounded">
                            <Button className="fs-5"><i className="bi bi-cart"/>    {cartItemsCount ? `${cartItemsCount} на ${totalPrice} грн` : 'Кошик'}</Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
