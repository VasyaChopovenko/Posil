import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {addProduct, fetchProducts} from "./productsSlice";
import {Container, Form, FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {selectAllCategories} from "../categories/categoriesSlice";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

export default function AddNewProduct() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [img, setImg] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const [integerPricePart, setIntegerPricePart] = useState(0);
    const [fractionalPricePart, setFractionalPricePart] = useState(0);
    const [name, setName] = useState('');
    const [count, setCount] = useState(0);
    const [countDesc, setCountDesc] = useState('');
    const [productCategory, setProductCategory] = useState(1);
    const categories = useSelector(selectAllCategories);
    const [weighable, setWeighable] = useState(false);
    const [minAmount, setMinAmount] = useState(1);
    const [minAmountError, setMinAmountError] = useState('');

    const allowSubmit = img && name && count && countDesc && integerPricePart && !minAmountError;

    const onSaveProductClicked = async () => {
        const newProduct = {
            name,
            price: `${integerPricePart}.${fractionalPricePart}`,
            count,
            countDesc,
            category_id: productCategory,
            weighable: weighable,
            minAmount
        };

        let formData = new FormData();
        formData.append('productImage', img);
        formData.append('product', JSON.stringify(newProduct));

        await dispatch(addProduct(formData));
        navigate(`/`);
    };

    const onCategoryChanged = (e) => {
        setProductCategory(e.target.value);
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
        setCount(e.target.value);
    };

    const onCountDescChanged = (e) => {
        setCountDesc(e.target.value);
    };

    const onFileChosen = (e) => {
        setImg(e.target.files[0]);
        setImgUrl(URL.createObjectURL(e.target.files[0]));
    };

    const onBoxChecked = (e) => {
        weighable ? setWeighable(false) : setWeighable(true);
    };

    const onMinAmountChanged = (e) => {
        if (e.target.value >= 0) {
            setMinAmount(e.target.value);
        }
    };

    const onMinAmountBlur = (e) => {
        if (e.target.value <= 0) {
            setMinAmountError('Мінімальна кількість не може = 0');
        } else {
            setMinAmountError('');
        }
    };

    const minAmountElem = <div><Form.Label className="mt-2">{minAmountError ?
        <div style={{color: "red"}}>{minAmountError}</div> : 'Мінімальна кількість при додаванні в корзину (у кілограмах):'}</Form.Label>
        <FormControl type="number" value={minAmount} onBlur={onMinAmountBlur} onChange={onMinAmountChanged}/></div>;

    const categoryOptions = categories.map(category => <option key={category.id}
                                                               value={category.id}>{category.name}</option>);

    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1 p-4">
                <div className="d-flex bg-white">
                    <img style={{width: '25rem', height: '25rem'}} className="me-5 p-3"
                         src={imgUrl || 'https://www.topperstutors.com/img/upload.png'}/>
                    <div style={{width: '40%'}}>
                        <Form>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Виберіть нове фото</Form.Label>
                                <Form.Control type="file" onChange={onFileChosen}/>
                            </Form.Group>
                            <Form.Check className="mt-2"
                                        type='checkbox' value={weighable} label="Ваговий товар" onChange={onBoxChecked}
                            />
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
                            <Form.Label className="mt-2">Наявна кількість {weighable ? '(у кілограмах)' : ''}:</Form.Label>
                            <FormControl type="number" value={count} onChange={onCountChanged}/>
                            <Form.Label className="mt-2">Опис кількості:</Form.Label>
                            <FormControl value={countDesc} onChange={onCountDescChanged}/>
                            {weighable && minAmountElem}
                        </Form>
                        <Button disabled={!allowSubmit} type="button" className="mt-3" onClick={onSaveProductClicked}>
                            Зберегти
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}
