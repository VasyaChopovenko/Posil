import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux"
import CartItem from "./CartItem";
import {ListGroup, Card} from "react-bootstrap"
import {createOrder, selectAllCartItemsIds} from "./cartSlice"
import {Button, Modal} from "react-bootstrap";
import {fetchProductsByIds} from "../products/productsSlice";
import {Form} from "react-bootstrap";
import {closeModal} from "./cartSlice"

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
        const phoneInput = e.target.value;

        if (phoneInput.length <= 10) {
            setPhone(phoneInput);

            if (isNaN(phoneInput)) {
                setPhoneError('Номер не повинен містити букви');
            } else {
                setPhoneError('');
            }

            if (phoneInput.length !== 10) {
                setPhoneError('Номер має містити 10 цифер');
            }
        }
    };

    const onAddressChanged = (e) => {
        const addressInput = e.target.value;
        setAddress(addressInput);
        if (addressInput.length > 150) {
            setAddressError('Адреса не може бути довшою ніж 200 символів');
        } else {
            setAddressError('');
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

    const orderCreated = useSelector(state => state.cart.orderCreated);

    const handleClose = () => {
        dispatch(closeModal());
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
                        <div className="mt-2 fw-bold">Всього: {(totalPrice + 49).toFixed(2)} грн</div>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>{phoneError ?
                            <div style={{color: "red"}}>{phoneError}</div> : 'Додайте номер телефону:'}</Form.Label>
                        <Form.Control value={phone} onChange={onPhoneChanged}
                                      placeholder="Без +(38)"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{addressError ?
                            <div style={{color: "red"}}>{addressError}</div> : 'Додайте адресу:'}</Form.Label>
                        <Form.Control value={address} onChange={onAddressChanged} as="textarea"
                                      style={{minHeight: '8rem', maxHeight: '20rem'}}/>
                    </Form.Group>
                    <Button onClick={onOrderConfirmed} variant="primary" className="m-auto mt-4"
                            disabled={addressError || !address || phoneError || cartItemsIds.length === 0}>Замовити</Button>
                </Card.Body>

                <Modal show={orderCreated} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Збережено!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Ваше замовлення успішно створене. Очікуйте дзвінок від кур'єра</Modal.Body>
                </Modal>
            </Card>
        </section>
    );
}
