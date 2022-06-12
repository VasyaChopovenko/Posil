import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchProductImage, selectProductById} from "./productsSlice";
import {Card, Button} from 'react-bootstrap';
import {addToCart} from "../cart/cartSlice";
import {selectCartItemById} from "../cart/cartSlice"
import './Product.css'
import {Link} from "react-router-dom";

export default function Product({id}) {
    const product = useSelector(state => selectProductById(state, id));
    const pricePerMinAmount = (product.price * product.minAmount).toFixed(2);
    const priceBeforePoint = pricePerMinAmount.toString().split('.')[0];
    const priceAfterPoint = pricePerMinAmount.toString().split('.')[1];
    const dispatch = useDispatch();
    const cartItem = useSelector(state => selectCartItemById(state, id));

    useEffect(() => {
        if (!product.imgUrl) {
            dispatch(fetchProductImage(product.id));
        }
    });

    const onAddToCartClicked = async () => {
        await dispatch(addToCart({...product, countInCart: product.count < product.minAmount ? product.count : product.minAmount}));
    };

    const addToCartButton = !cartItem ?
        <Button disabled={product.count === 0 || !product.active} onClick={onAddToCartClicked} variant="primary"><i className="bi bi-cart-plus"/>{product.count === 0 ? 'Немає в наявності' : !product.active ? 'Деактивовано' : 'У кошик'}</Button> :
        <Button disabled variant="primary"><i className="bi bi-cart-check"/> Додано</Button>;

    return (
        <Card className="shadow-sm bg-white rounded m-1" style={{minWidth: '16rem', maxWidth: '23rem'}}>
            <Link style={{zIndex: 10}} to={`/products/${product.id}`}
                    className="ms-auto mt-1 me-1"><i className="bi bi-pencil-square"/></Link>
            <Card.Img variant="top" className="m-auto mt-auto w-75" style={{opacity: (product.active && product.count) || '0.5'}} src={product.imgUrl}/>
            <div>
                <Card.Body>
                    <Card.Title className="fs-5">{product.name}</Card.Title>
                    <div>
                        <p className="m-auto">{product.countDesc}</p>
                        <hr className="product_line"/>
                        <div className="d-flex justify-content-between">
                            <div className="d-inline-block position-relative w-auto fs-5 fw-bold">
                                {priceBeforePoint}
                                <span className="position-absolute top-0 start-100 ms-1 fs-6">{priceAfterPoint}</span>
                            </div>
                            {addToCartButton}
                        </div>
                    </div>
                </Card.Body>
            </div>
        </Card>
    );
}
