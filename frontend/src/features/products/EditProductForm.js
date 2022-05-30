import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts, selectProductById, updateProduct} from "./productsSlice"
import {useParams} from "react-router";
import http from "../../http-common";
import {Container, Form, FormControl, InputGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from 'react-router-dom';

export default function EditProductForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productId = useParams().productId;
    const productsStatus = useSelector((state) => state.products.status);

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
    }, [productsStatus]);

    const product = useSelector((state) => selectProductById(state, productId));
    const [imgUrl, setImgUrl] = useState('');

    const [intPricePart, fracPricePart] = product.price.split('.');
    const [integerPricePart, setIntegerPricePart] = useState(intPricePart);
    const [fractionalPricePart, setFractionalPricePart] = useState(fracPricePart);
    const [name, setName] = useState(product.name);
    const [count, setCount] = useState(product.count);

    const [isLoading, setLoading] = useState(false);



    useEffect(() => {
        if (!imgUrl) {
            http.get(`/products/${product.id}/image`, {responseType: 'blob'})
                .then(response => {
                    setImgUrl(URL.createObjectURL(response.data));
                })
                .catch(error => console.error(error));
        }
    });

    const onSaveProductClicked = async () => {
        setLoading(true);
        await dispatch(updateProduct({
            ...product, price: `${integerPricePart}.${fractionalPricePart}`, count, name
        }));
        setLoading(false);
        navigate(`/`);
    };

    const onIntegerPricePart = (e) => {
        setIntegerPricePart(e.target.value);
    };

    const onFractionalPricePart = (e) => {
        if (e.target.value <= 99) {
            setFractionalPricePart(e.target.value);
        }
    };

    const onNameChanged = (e) => {
        setName(e.target.value);
    };

    const onCountChanged = (e) => {
        setCount(e.target.value);
    };

    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1">
                <div className="d-flex bg-white">
                    <img style={{width: '30rem'}} className="me-5" src={imgUrl}/>
                    <div>
                        <Form>
                            <Form.Label className="mt-2">Назва</Form.Label>
                            <FormControl value={name} onChange={onNameChanged}/>
                            <Form.Label className="mt-2">Ціна</Form.Label>
                            <div className="d-flex">
                                <FormControl style={{width: '5rem'}} type="number" value={integerPricePart}
                                             onChange={onIntegerPricePart}/>
                                <span className="align-self-end fs-2 ms-2 me-2">.</span>
                                <FormControl style={{width: '5rem'}} type="number" value={fractionalPricePart}
                                             onChange={onFractionalPricePart}/>
                                <span className="align-self-end ms-2 me-2">грн</span>
                            </div>
                            <Form.Label className="mt-2">Наявна кількість:</Form.Label>
                            <FormControl type="number" value={count} onChange={onCountChanged}/>
                        </Form>
                        <Button disabled={isLoading} type="button" className="mt-3" onClick={onSaveProductClicked}>
                            Зберегти
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}
