import React, {useEffect} from "react";
import {useSelector} from "react-redux"
import CartItem from "./CartItem";
import {ListGroup, Container} from "react-bootstrap"
import {fetchProducts} from "../products/productsSlice";
import {useDispatch} from "react-redux"

export default function Cart() {
    const dispatch = useDispatch();
    const cartItemsIds = useSelector(state => state.cartItems);
    const productsStatus = useSelector((state) => state.products.status);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    });

    const cartItems = productsStatus === 'succeeded' ? cartItemsIds.map(itemId =>
        <ListGroup.Item key={itemId}><CartItem itemId={itemId}/></ListGroup.Item>) : (<div></div>);

    return (
        <Container>
            <ListGroup>
                {cartItems}
            </ListGroup>
        </Container>
    );
}
