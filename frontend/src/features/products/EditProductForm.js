import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteProduct,
    fetchProductImage,
    fetchProductsByIds,
    selectProductById, setFetchIdleStatus,
    updateProduct,
    updateProductImage
} from "./productsSlice"
import {useParams} from "react-router";
import {Container, Form, FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useNavigate} from 'react-router-dom';
import {selectAllCategories} from "../categories/categoriesSlice";

export default function EditProductForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const productId = useParams().productId;
    const categories = useSelector(selectAllCategories);

    useEffect(() => {
        if (!product) {
            dispatch(fetchProductsByIds({"ids": productId}));
        }
    });

    useEffect(() => {
        if (product && !imgUrl) {
            dispatch(fetchProductImage(product.id));
        }
    });

    const product = useSelector(state => selectProductById(state, productId));

    const [imgUrl, setImgUrl] = useState('');
    const [img, setImg] = useState('');

    const [integerPricePart, setIntegerPricePart] = useState(0);
    const [fractionalPricePart, setFractionalPricePart] = useState(0);
    const [name, setName] = useState(product ? product.name : '');
    const [count, setCount] = useState(product?.count || 0);
    const [countDesc, setCountDesc] = useState(product?.countDesc || '');
    const [productCategory, setProductCategory] = useState(1);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            const [intPricePart, fracPricePart] = product ? product.price.split('.') : [0, 0];
            setImgUrl(product.imgUrl);
            setIntegerPricePart(intPricePart);
            setFractionalPricePart(fracPricePart);
            setName(product.name);
            setCount(product.count);
            setCountDesc(product.countDesc);
            setProductCategory(product.category_id);
        }
    }, [product]);

    const onSaveProductClicked = async () => {
        setLoading(true);
        await dispatch(updateProduct({
            ...product, price: `${integerPricePart}.${fractionalPricePart}`, count, name, category_id: productCategory
        }));
        if (img) {
            await updateImage();
        }
        setLoading(false);
        await dispatch(setFetchIdleStatus());
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

    const onCategoryChanged = (e) => {
        setProductCategory(e.target.value);
    };

    const onFileChosen = (e) => {
        setImg(e.target.files[0]);
        setImgUrl(URL.createObjectURL(e.target.files[0]));
    };

    const onDeleteProductClicked = () => {
        dispatch(deleteProduct(productId));
        navigate(`/`);
    };

    const categoryOptions = categories.map(category => <option key={category.id}
                                                               value={category.id}>{category.name}</option>);
    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1 pb-2">
                <div className="d-flex bg-white">
                    <img style={{minWidth: '30rem', maxHeight: '30rem'}} src={imgUrl || img}/>
                    <div>
                        <Form>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Виберіть нове фото</Form.Label>
                                <Form.Control type="file" onChange={onFileChosen}/>
                            </Form.Group>
                            <Form.Label className="mt-2">Назва</Form.Label>
                            <FormControl value={name} onChange={onNameChanged}/>
                            <Form.Label className="mt-2">Категорія</Form.Label>
                            <Form.Select value={productCategory} onChange={onCategoryChanged}>
                                {categoryOptions}
                            </Form.Select>
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
                            <Button disabled={isLoading} type="button" className="mt-3"
                                    onClick={onSaveProductClicked}>
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
