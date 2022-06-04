import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteProduct,
    fetchProductImage,
    fetchProducts,
    selectProductById,
    updateProduct,
    updateProductImage
} from "./productsSlice"
import {useParams} from "react-router";
import {Container, Form, FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from 'react-router-dom';

export default function EditProductForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productId = useParams().productId;

    useEffect(() => {
        dispatch(fetchProductImage(product.id));
    }, []);

    const product = useSelector(state => selectProductById(state, productId));

    const [imgUrl, setImgUrl] = useState('');
    const [img, setImg] = useState(product.imgUrl);

    const [intPricePart, fracPricePart] = product.price.split('.');
    const [integerPricePart, setIntegerPricePart] = useState(intPricePart);
    const [fractionalPricePart, setFractionalPricePart] = useState(fracPricePart);
    const [name, setName] = useState(product.name);
    const [count, setCount] = useState(product.count);
    const [countDesc, setCountDesc] = useState(product.countDesc);

    const [isLoading, setLoading] = useState(false);

    const onSaveProductClicked = async () => {
        setLoading(true);
        await dispatch(updateProduct({
            ...product, price: `${integerPricePart}.${fractionalPricePart}`, count, name
        }));
        if (img) {
            await updateImage();
        }
        setLoading(false);
        navigate(`/`);
    };

    const updateImage = async () => {
        let formData = new FormData();
        formData.append('productImage', img);
        dispatch(updateProductImage({formData, productId: product.id}))
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

    const onCountDescChanged = (e) => {
        setCountDesc(e.target.value);
    };

    const onFileChosen = (e) => {
        setImg(e.target.files[0]);
        setImgUrl(URL.createObjectURL(e.target.files[0]));
    };

    const onDeleteProductClicked = () => {
        dispatch(deleteProduct(productId));
        navigate(`/`);
    };

    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1 pb-2">
                <div className="d-flex bg-white">
                    <img style={{maxWidth: '30rem', maxHeight: '30rem'}} src={imgUrl || product.imgUrl}/>
                    <div>
                        <Form>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Виберіть нове фото</Form.Label>
                                <Form.Control type="file" onChange={onFileChosen}/>
                            </Form.Group>
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
                            <Form.Label className="mt-2">Опис кількості:</Form.Label>
                            <FormControl value={countDesc} onChange={onCountDescChanged}/>
                        </Form>
                        <div className="d-flex justify-content-between">
                            <Button disabled={isLoading} type="button" className="mt-3" onClick={onSaveProductClicked}>
                                Зберегти
                            </Button>
                            <Button disabled={isLoading} type="button" variant="danger" className="mt-3"
                                    onClick={onDeleteProductClicked}>
                                Видалити
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
