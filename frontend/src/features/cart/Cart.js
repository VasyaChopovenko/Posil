import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import CartItem from "./CartItem";
import {ListGroup, Card} from "react-bootstrap"
import {createOrder, selectAllCartItemsIds} from "./cartSlice"
import Button from "react-bootstrap/Button";
import {fetchProducts, fetchProductsByIds} from "../products/productsSlice";
import {Form} from "react-bootstrap";

export default function Cart() {
    const dispatch = useDispatch();
    const cartItemsIds = useSelector(selectAllCartItemsIds);
    const totalPrice = useSelector(state => state.cart.totalPrice);
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const productsStatus = useSelector((state) => state.products.status);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProductsByIds({"ids": cartItemsIds}));
        }
    });

    const onPhoneChanged = (e) => {
        if (e.target.value.length > 10) {
            setPhoneError('Номер не може перевищувати 10 цифр');
        } else if (isNaN(e.target.value)) {
            setPhoneError('Номер не містить букв');
        } else {
            setPhoneError('');
            setPhone(e.target.value);
        }
    };

    const onAddressChanged = (e) => {
        if (e.target.value.length > 200) {
            setAddressError('Адреса не може бути довшою ніж 200 символів');
        } else {
            setAddressError('');
            setAddress(e.target.value);
        }
    };

    const onPhoneBlur = (e) => {
        if (e.target.value.length === 10) {
            setPhoneError('');
        } else {
            setPhoneError('Введіть коректний номер');
        }
    };

    const onAddressBlur = (e) => {
        if (e.target.value.length <= 200) {
            setAddressError('');
        } else {
            setAddressError('Введіть коректну адресу');
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

    const onOrderConfirmed = async () => {
        dispatch(createOrder({phone, address}));
        setPhone('');
        setAddress('');
    };

    return (
        <section className="d-lg-flex gap-2 m-2">
            <ListGroup className="w-100 gap-2">
                {cartItems}
            </ListGroup>
            <Card style={{top: '1%', minWidth: '25%'}} className="position-sticky h-75 shadow-sm">
                <Card.Body className="d-flex mt-2 flex-column">
                    <div className="mb-2">
                        <div>Доставка: 49.00 грн</div>
                        <div className="mt-2 fw-bold">Всього: {totalPrice + 49} грн</div>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>{phoneError ?
                            <div style={{color: "red"}}>{phoneError}</div> : 'Додайте номер телефону:'}</Form.Label>
                        <Form.Control onBlur={onPhoneBlur} value={phone} onChange={onPhoneChanged}
                                      placeholder="Без +(38)"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{addressError ?
                            <div style={{color: "red"}}>{addressError}</div> : 'Додайте адресу:'}</Form.Label>
                        <Form.Control value={address} onBlur={onAddressBlur} onChange={onAddressChanged} as="textarea"
                                      style={{minHeight: '8rem', maxHeight: '20rem'}}/>
                    </Form.Group>
                    <Button onClick={onOrderConfirmed} variant="primary" className="m-auto mt-4"
                            disabled={addressError || !address || cartItemsIds.length === 0}>Замовити</Button>
                </Card.Body>
            </Card>
        </section>
    );
}
