import Container from "react-bootstrap/Container";
import {Button, Nav, Navbar} from "react-bootstrap";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectAllCartItems} from "../features/cart/cartSlice"
import {fetchCategories, selectAllCategories,} from "../features/categories/categoriesSlice";
import {fetchProducts} from "../features/products/productsSlice";
import {Dropdown} from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function NavBar() {
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

    const productsStatus = useSelector((state) => state.products.status);
    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    });

    const onCategoryChanged = (categoryId) => {
        console.log(categoryId);
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
                        <Nav.Link href="/products/add" className="p-0 text-white rounded me-1">
                            <Button variant="outline-primary" className="fs-5">Додати продукт</Button>
                        </Nav.Link>
                        <Nav.Link href="/cart" bg="primary" className="p-0 bg-primary text-white rounded">
                            <Button className="fs-5"><i
                                className="bi bi-cart"/> {cartItemsCount ? `${cartItemsCount} на ${totalPrice} грн` : 'Кошик'}
                            </Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Dropdown as={ButtonGroup} align="end" onSelect={onCategoryChanged}>
                    <Button className="fs-5" variant="primary">Товари</Button>
                    <Dropdown.Toggle split variant="primary" id="dropdown-split-basic"/>
                    <Dropdown.Menu>
                        {categoryItems}
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
        </Navbar>
    );
}
