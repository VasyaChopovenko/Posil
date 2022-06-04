import {useSelector} from "react-redux";
import {selectProductsIds} from "./productsSlice";
import React from "react";
import Product from "./Product";

export function ProductsList() {
    const productsIds = useSelector(selectProductsIds);

    const content = productsIds.map(productId => <Product key={productId} id={productId}/>);

    return (
        <div className="product_grid">
            {content}
        </div>
    );
}
