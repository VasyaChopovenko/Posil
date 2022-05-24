import React, {useEffect} from "react";
import {useSelector} from "react-redux"
import CartItem from "./CartItem";
import {ListGroup, Container, Card} from "react-bootstrap"
import {fetchProducts} from "../products/productsSlice";
import {useDispatch} from "react-redux"
import {selectAllCartItemsIds} from "./cartSlice"
import Button from "react-bootstrap/Button";

export default function Cart() {
    const dispatch = useDispatch();
    const cartItemsIds = useSelector(selectAllCartItemsIds);
    const productsStatus = useSelector((state) => state.products.status);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    });

    const cartItems = productsStatus === 'succeeded' && cartItemsIds.length > 0 ? cartItemsIds.map(itemId =>
            <ListGroup.Item key={itemId}><CartItem itemId={itemId}/></ListGroup.Item>) :
        <Card>
            <Card.Body className="d-flex mt-4 flex-column align-items-center">
                <Card.Title>У вашому кошику немає товарів</Card.Title>
                <Button variant="primary" className="m-auto mt-4" href={"/"}>До товарів</Button>
            </Card.Body>
        </Card>;

    return (
        <Container>
            <ListGroup>
                {cartItems}
            </ListGroup>
        </Container>
    );
}
