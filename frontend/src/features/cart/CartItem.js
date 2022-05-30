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
        dispatch(deleteFromCart({id: cartItem.id, price: cartItem.price, count: cartItem.count}));
    };

    const onCounterClicked = (value) => {
        dispatch(updateCartItem({...cartItem, count: value}));
    };

    return (
        <div className="d-flex align-items-center justify-content-evenly">
            <img style={{width: '6rem'}} src={imgUrl}/>
            <div style={{minWidth: '12rem', maxWidth: '12rem'}}>{cartItem.name}</div>
            <div>{cartItem.countDesc}</div>
            <div>{cartItem.price} грн</div>
            <Counter onChange={onCounterClicked} defaultValue={cartItem.count}/>
            <Button onClick={onDeleteFromCartClicked}><i className="bi bi-trash3"/></Button>
            <div style={{minWidth: '4rem', maxWidth: '4rem'}}>{cartItem.totalPrice} грн</div>
        </div>
    );
}
