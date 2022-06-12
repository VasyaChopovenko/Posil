import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {addProduct} from "./productsSlice";
import {Container, Form, FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {selectAllCategories} from "../categories/categoriesSlice";

export default function AddNewProduct() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [img, setImg] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const [integerPricePart, setIntegerPricePart] = useState('');
    const [fractionalPricePart, setFractionalPricePart] = useState('');
    const [name, setName] = useState('');
    const [count, setCount] = useState('');
    const [countError, setCountError] = useState('');
    const [countDesc, setCountDesc] = useState('');
    const [productCategory, setProductCategory] = useState(1);
    const categories = useSelector(selectAllCategories);
    const [weighable, setWeighable] = useState(false);
    const [minAmount, setMinAmount] = useState('');
    const [minAmountError, setMinAmountError] = useState('');

    let allowSubmit = weighable ?
        minAmount && !minAmountError && img && name && count && !countError && integerPricePart :
        img && name && count && countDesc && !countError && integerPricePart;

    const onSaveProductClicked = async () => {
        const newProduct = {
            name,
            price: `${integerPricePart}.${fractionalPricePart ? fractionalPricePart : '0'}`,
            count,
            countDesc: weighable ? getCountDescForWeighableProduct() : countDesc,
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

    const getCountDescForWeighableProduct = () => {
        if (+minAmount < 1) {
            return (minAmount * 1000) + ' г';
        } else {
            return minAmount + ' кг';
        }
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
        const newCount = e.target.value;
        setCount(newCount);

        if (newCount <= 0) {
            setCountError('Кількість не можи бути меншою або дорівнювати нулю');
        } else if (!Number.isInteger(+newCount) && !weighable) {
            setCountError('Кількість невагового товару не може бути дробовим числом');
        } else {
            setCountError('');
        }

        if (weighable && minAmount > newCount) {
            setMinAmountError('Мінімальна кількість не може бути більшою за наявну');
        } else if (minAmount > 0) {
            setMinAmountError('');
        }
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

    const minAmountElem =
        <Form.Group>
            {!minAmountError ?
                <Form.Label
                    className="mt-2">{'Мінімальна кількість при додаванні в корзину (у кілограмах):'}</Form.Label> :
                <Form.Label style={{color: 'red'}} className="mt-2">{minAmountError}</Form.Label>}
            <FormControl type="number" value={minAmount} onChange={onMinAmountChanged}/>
        </Form.Group>;

    const categoryOptions = categories.map(category => <option key={category.id}
                                                               value={category.id}>{category.name}</option>);

    return (
        <Container>
            <div className="shadow-sm bg-white rounded m-1 p-4">
                <div className="d-flex bg-white">
                    <img style={{maxWidth: '30rem', maxHeight: '30rem'}} className="p-4 w-auto h-auto"
                         src={imgUrl || 'https://www.topperstutors.com/img/upload.png'}/>
                    <div style={{width: '40%'}}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Виберіть нове фото</Form.Label>
                                <Form.Control type="file" onChange={onFileChosen}/>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Check className="mt-2"
                                        type='checkbox' value={weighable} label="Ваговий товар" onChange={onBoxChecked}
                            />
                            <Form.Group>
                                <Form.Label className="mt-2">Назва:</Form.Label>
                                <FormControl value={name} onChange={onNameChanged}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="mt-2">Категорія:</Form.Label>
                                <Form.Select value={productCategory} onChange={onCategoryChanged}>
                                    {categoryOptions}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="mt-2">Ціна{weighable && ' (за кілограм)'}:</Form.Label>
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
                                        кількість{weighable ? ' (у кілограмах)' : ''}:</Form.Label> :
                                    <Form.Label className="mt-2" style={{color: 'red'}}>{countError}:</Form.Label>}
                                <FormControl type="number" value={count} onChange={onCountChanged}/>
                            </Form.Group>
                            {weighable ||
                            <Form.Group>
                                <Form.Label className="mt-2">Опис кількості:</Form.Label>
                                <FormControl value={countDesc} onChange={onCountDescChanged}/>
                            </Form.Group>}
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
