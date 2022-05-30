import {useSelector, useDispatch} from "react-redux";
import {fetchProducts, selectProductsIds} from "./productsSlice";
import React, {useEffect} from "react";
import Product from "./Product";

export function ProductsList() {
    const dispatch = useDispatch();
    const productsIds = useSelector(selectProductsIds);
    const productsStatus = useSelector((state) => state.products.status);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    });

    const content = productsIds.map(productId => <Product key={productId} id={productId}/>);

    return (
        <div className="product_grid">
            {content}
        </div>
    );
}
