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
            dispatch(fetchProductsByIds({"ids": [productId]}));
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
    const [countError, setCountError] = useState('');
    const [countDesc, setCountDesc] = useState(product?.countDesc || '');
    const [productCategory, setProductCategory] = useState(1);
    const [minAmount, setMinAmount] = useState(product?.minAmount || 0);
    const [minAmountError, setMinAmountError] = useState('');

    const [isLoading, setLoading] = useState(false);

    const allowSubmit = name && count && countDesc && integerPricePart && !countError && !minAmountError;

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
            setMinAmount(product.minAmount);
        }
    }, [product]);

    const onSaveProductClicked = async () => {
        setLoading(true);
        await dispatch(updateProduct({
            id: product.id,
            name,
            price: `${integerPricePart}.${fractionalPricePart ? fractionalPricePart : '0'}`,
            count: +count,
            countDesc: product.weighable ? getCountDescForWeighableProduct() : countDesc,
            category_id: productCategory,
            weighable: product.weighable,
            minAmount
        }));
        if (img) {
            await updateImage();
        }
        setLoading(false);
        await dispatch(setFetchIdleStatus());
        navigate(`/`);
    };

    const getCountDescForWeighableProduct = () => {
        if (+minAmount < 1) {
            return (minAmount * 1000) + ' г';
        } else {
            return minAmount + ' кг';
        }
    };

    const updateImage = async () => {
        let formData = new FormData();
        formData.append('productImage', img);
        dispatch(updateProductImage({formData, productId: product.id}))
    };

    const onIntegerPricePart = (e) => {
        if (e.target.value >= 0 && !e.target.value.includes('.')) {
            setIntegerPricePart(e.target.value);
        }
    };

    const onFractionalPricePart = (e) => {
        if (e.target.value <= 99 && e.target.value >= 0 && !e.target.value.includes('.')) {
            setFractionalPricePart(e.target.value);
        }
    };

    const onNameChanged = (e) => {
        setName(e.target.value);
    };

    const onCountChanged = (e) => {
        const newCount = e.target.value;
        setCount(newCount);

        if (newCount <= 0) {
            setCountError('Кількість не можи бути меншою або дорівнювати нулю');
        } else if (!Number.isInteger(+newCount) && !product.weighable) {
            setCountError('Кількість невагового товару не може бути дробовим числом');
        } else {
            setCountError('');
        }

        if (product.weighable && minAmount > newCount) {
            setMinAmountError('Мінімальна кількість не може бути більшою за наявну');
        } else {
            setMinAmountError('');
        }
    };

    const onMinAmountChanged = (e) => {
        const newMinAmount = e.target.value;

        setMinAmount(newMinAmount);

        if (+newMinAmount <= 0) {
            setMinAmountError('Мінімальна кількість не бути менше або дорівнювати нулю');
        } else if (+newMinAmount > +count) {
            setMinAmountError('Мінімальна кількість не може бути більшою за наявну');
        } else {
            setMinAmountError('');
        }
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

    const onActivateDeactivateProductClicked = () => {
        dispatch(updateProduct({id: product.id, active: !product.active}));
    };

    const onDeleteProductClicked = () => {
        dispatch(deleteProduct(product.id));
    };

    const minAmountElem =
        <Form.Group>
            {!minAmountError ?
                <Form.Label className="mt-2">Мінімальна кількість при додаванні в кошик (у кілограмах):</Form.Label> :
                <Form.Label style={{color: 'red'}} className="mt-2">{minAmountError}</Form.Label>}
            <FormControl onChange={onMinAmountChanged} disabled={product?.active} type="number" value={minAmount}/>
        </Form.Group>;

    const categoryOptions = categories.map(category => <option key={category.id}
                                                               value={category.id}>{category.name}</option>);
    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1 pb-2">
                <div className="d-flex justify-content-evenly bg-white">
                    <div style={{width: '25rem'}}><img style={{objectFit: 'contain'}}
                                                       className="p-2 position-relative top-0 d-block h-100 w-100"
                                                       src={imgUrl || img}/>
                    </div>
                    <div style={{width: '40%'}}>
                        <Form>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Виберіть нове фото</Form.Label>
                                <Form.Control type="file" onChange={onFileChosen}/>
                            </Form.Group>
                            <Form.Check className="mt-2"
                                        type='checkbox' checked={product?.weighable || false} label="Ваговий товар"
                                        disabled
                            />
                            <Form.Group>
                                <Form.Label className="mt-2">Назва</Form.Label>
                                <FormControl value={name} onChange={onNameChanged}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="mt-2">Категорія</Form.Label>
                                <Form.Select value={productCategory} onChange={onCategoryChanged}>
                                    {categoryOptions}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="mt-2">Ціна</Form.Label>
                                <div className="d-flex">
                                    <FormControl style={{width: '5rem'}} type="number" value={integerPricePart}
                                                 onChange={onIntegerPricePart}/>
                                    <span className="align-self-end fs-2 ms-2 me-2">.</span>
                                    <FormControl style={{width: '5rem'}} type="number" value={fractionalPricePart}
                                                 onChange={onFractionalPricePart}/>
                                    <span className="align-self-end ms-2 me-2">грн</span>
                                </div>
                            </Form.Group>
                            <Form.Group>
                                {!countError ? <Form.Label className="mt-2">Наявна
                                        кількість{product?.weighable ? ' (у кілограмах)' : ''}:</Form.Label> :
                                    <Form.Label className="mt-2" style={{color: 'red'}}>{countError}:</Form.Label>}
                                <FormControl type="number" value={count} onChange={onCountChanged}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="mt-2">Опис кількості:</Form.Label>
                                <FormControl value={countDesc} onChange={onCountDescChanged}/>
                            </Form.Group>
                            {product?.weighable && minAmountElem}
                        </Form>
                        <div className="d-flex justify-content-between">
                            <Button disabled={!allowSubmit || isLoading} type="button" className="mt-3"
                                    onClick={onSaveProductClicked}>
                                Зберегти
                            </Button>
                            <Button disabled={isLoading} type="button" variant={product?.active ? 'warning' : 'success'}
                                    className="mt-3"
                                    onClick={onActivateDeactivateProductClicked}>
                                {product?.active ? 'Деактивувати' : 'Активувати'}
                            </Button>
                            <Button disabled={product?.active} type="button" variant="danger"
                                    className="mt-3"
                                    onClick={onDeleteProductClicked} href="/">
                                Видалити
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
