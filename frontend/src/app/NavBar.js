import Container from "react-bootstrap/Container";
import {Button, Nav, Navbar} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectAllCartItems} from "../features/cart/cartSlice"
import {fetchCategories, selectAllCategories, updateCategory,} from "../features/categories/categoriesSlice";
import {fetchProducts} from "../features/products/productsSlice";
import {Dropdown} from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {useNavigate} from "react-router";

export default function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectAllCartItems);
    const cartItemsCount = cartItems.length;
    const totalPrice = useSelector(state => state.cart.totalPrice);
    const categories = useSelector(selectAllCategories);

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchCategories());
        }
    });

    const onCategoryChanged = async (categoryId) => {
        dispatch(updateCategory(categoryId));
        await dispatch(fetchProducts(categoryId));
        navigate('/');
    };

    const categoryItems = categories.map(category => <Dropdown.Item key={category.id}
                                                                    eventKey={category.id}>{category.name}</Dropdown.Item>);

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid className="align-items-stretch">
                {/*<Navbar.Brand className="fw-bold m-auto">Posil</Navbar.Brand>*/}
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav
                        className="my-2 my-lg-0 fs-4"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <Nav.Link href="/cart" className="p-0 bg-primary text-white rounded me-1">
                            <Button className="fs-5"><i className="bi bi-basket"/> {cartItemsCount ? `${cartItemsCount} на ${totalPrice} грн` : 'Кошик'}
                            </Button>
                        </Nav.Link>
                        <Nav.Link href="/products/add" className="p-0 text-white rounded me-1">
                            <Button variant="outline-primary" className="fs-5 w-100"><i className="bi bi-plus-square"/> Додати продукт</Button>
                        </Nav.Link>
                        <Nav.Link href="/orders" className="p-0 text-white rounded">
                            <Button variant="outline-primary" className="fs-5 w-100"><i className="bi bi-truck"/> Замовлення</Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Dropdown as={ButtonGroup} align="end" onSelect={onCategoryChanged}>
                    <Button className="fs-5" variant="primary" href="/">Товари</Button>
                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic"/>
                    <Dropdown.Menu>
                        {categoryItems}
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}
