import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import http from "../../http-common";
import {selectProductById} from "../products/productsSlice"
import Counter from "./Counter.js";
import {Button} from "react-bootstrap";

export default function CartItem({itemId}) {
    const cartItem = useSelector(state => selectProductById(state, itemId));
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

    return (
        <div className="d-flex align-items-center justify-content-around">
            <img style={{width: '8rem'}} src={imgUrl}/>
            <div className="">{cartItem.name}</div>
            <div>{cartItem.countDesc}</div>
            <div>{cartItem.price} грн</div>
            <Counter/>
            <Button><i className="bi bi-trash3"/></Button>
        </div>
);
}
