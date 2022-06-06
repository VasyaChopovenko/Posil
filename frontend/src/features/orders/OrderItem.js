import {useSelector} from "react-redux";
import {selectProductById} from "../products/productsSlice";
import React from "react";

export default function OrderItem({productId, itemCount}) {
    const product = useSelector(state => selectProductById(state, productId));

    if (product) {
        return (
            <div>
                <p className="m-0">{product.name} | {itemCount} x {product.countDesc}</p>
            </div>
        );
    } else {
        return <div>empty</div>
    }
}