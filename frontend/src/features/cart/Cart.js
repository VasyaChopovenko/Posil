import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import CartItem from "./CartItem";
import {ListGroup, Card} from "react-bootstrap"
import {selectAllCartItemsIds} from "./cartSlice"
import Button from "react-bootstrap/Button";

export default function Cart() {
    const dispatch = useDispatch();
    const cartItemsIds = useSelector(selectAllCartItemsIds);
    const totalPrice = useSelector(state => state.cart.totalPrice);
    const [comment, setComment] = useState('');

    const [commentError, setCommentError] = useState('');

    const onCommentChanged = (e) => {
        if (e.target.value.length > 800) {
            setCommentError('Коментар не може бути довший ніж 800 символів');
        } else {
            setCommentError('');
            setComment(e.target.value);
        }
    };

    const cartItems = cartItemsIds.length > 0 ? cartItemsIds.map(itemId =>
            <ListGroup.Item className="shadow-sm" key={itemId}><CartItem itemId={itemId}/></ListGroup.Item>) :
        <Card>
            <Card.Body className="d-flex mt-4 flex-column align-items-center">
                <Card.Title>У вашому кошику немає товарів</Card.Title>
                <Button variant="primary" className="m-auto mt-4" href={"/"}>До товарів</Button>
            </Card.Body>
        </Card>;

    const onOrderConfirmed = () => {
        dispatch();
    };

    return (
        <section className="d-flex gap-2 m-2">
            <ListGroup className="w-75 gap-2">
                {cartItems}
            </ListGroup>
            <Card style={{top: '1%'}} className="w-25 position-sticky h-75 shadow-sm">
                <Card.Body className="d-flex mt-2 flex-column">
                    <div>
                        <div>Доставка: 49.00 грн</div>
                        <div className="mt-2 fw-bold">Всього: {totalPrice + 49} грн</div>
                    </div>
                    <label className="mt-2 mb-2">
                        Додайте коментар за бажанням:
                        {(commentError) && <div style={{color: "red"}}>{commentError}</div>}
                    </label>
                    <textarea style={{minHeight: '8rem', maxHeight: '20rem'}} placeholder="..." value={comment}
                              onChange={onCommentChanged}/>
                    <Button onClick={onOrderConfirmed} variant="primary" className="m-auto mt-4"
                            disabled={commentError || cartItemsIds.length === 0} href={"/"}>Замовити</Button>
                </Card.Body>
            </Card>
        </section>
    );
}
