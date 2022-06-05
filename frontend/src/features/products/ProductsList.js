import {useDispatch, useSelector} from "react-redux";
import {fetchProducts, selectProductsIds} from "./productsSlice";
import React, {useEffect} from "react";
import Product from "./Product";
import {Card} from "react-bootstrap";

export function ProductsList() {
    const dispatch = useDispatch();
    const productsIds = useSelector(selectProductsIds);
    const productsStatus = useSelector((state) => state.products.status);
    const categoryId = useSelector(state => state.categories.activeCategory);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts(categoryId));
        }
    });

    const content = productsIds.map(productId => <Product key={productId} id={productId}/>);

    if (content.length !== 0 && productsStatus === 'succeeded') {
        return (
            <div className="product_grid">
                {content}
            </div>
        );
    } else {
        return (
            <Card className="shadow-sm">
                <Card.Body style={{marginTop: '15rem', marginBottom: '15rem'}} className="d-flex flex-column align-items-center">
                    <Card.Title>В даній категорії немає товарів</Card.Title>
                    <i className="bi bi-emoji-frown fs-1"/>
                </Card.Body>
            </Card>
        );
    }
}
