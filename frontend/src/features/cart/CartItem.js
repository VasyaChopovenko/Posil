import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import http from "../../http-common";
import Counter from "./Counter.js";
import {Button} from "react-bootstrap";
import {deleteFromCart} from "../cart/cartSlice";
import {selectCartItemById, updateCartItem} from "./cartSlice";

export default function CartItem({itemId}) {
    const dispatch = useDispatch();
    const cartItem = useSelector(state => selectCartItemById(state, itemId));
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        if (!imgUrl) {
            http.get(`/products/${itemId}/image`, {responseType: 'blob'})
                .then(response => {
                    setImgUrl(URL.createObjectURL(response.data));
                })
                .catch(error => console.error(error));
        }
    }, [imgUrl]);

    const onDeleteFromCartClicked = () => {
        dispatch(deleteFromCart(cartItem.id));
    };

    const onCounterClicked = (value) => {
        dispatch(updateCartItem({...cartItem, countInCart: value}));
    };

    return (
        <div className="d-md-flex align-items-center justify-content-evenly">
            <img className="me-lg-4" style={{width: '6rem'}} src={imgUrl}/>
            <div className="me-lg-4" style={{minWidth: '8rem', maxWidth: '8rem'}}>{cartItem.name}</div>
            <div className="me-lg-4" style={{minWidth: '3rem', maxWidth: '5rem'}}>{cartItem.countDesc}</div>
            <div className="me-lg-4" style={{minWidth: '6rem', maxWidth: '8rem'}}>{cartItem.price} грн</div>
            <Counter maxValue={cartItem.count} onChange={onCounterClicked}
                     defaultValue={cartItem.countInCart} weighable={cartItem.weighable} minAmount={cartItem.minAmount}/>
            <Button className="ms-lg-4" onClick={onDeleteFromCartClicked}><i className="bi bi-trash3"/></Button>
            <div className="ms-lg-4" style={{minWidth: '4rem', maxWidth: '4rem'}}>{cartItem.totalPrice} грн</div>
        </div>
    );
}
