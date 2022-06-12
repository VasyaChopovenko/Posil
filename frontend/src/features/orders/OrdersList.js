import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectAllOrders} from "./ordersSlice";
import {Accordion, Form} from "react-bootstrap";
import Order from "./Order";
import Container from "react-bootstrap/Container";
import {fetchProductsByIds} from "../products/productsSlice";

export default function OrdersList() {
    const dispatch = useDispatch();

    const smallestToBiggest = (a, b) => {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    };

    const biggestToSmallest = (a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    };

    const statuses = ['Нове', 'В процесі', 'Виконано'];
    const sorts = [biggestToSmallest, smallestToBiggest];

    const [filter, setFilter] = useState(3);
    const [sort, setSort] = useState(0);

    const orders = useSelector(selectAllOrders);
    const ordersFetchStatus = useSelector(state => state.orders.fetchStatus);
    const ordersProductsIds = useSelector(state => state.orders.productsIds);
    const productsStatus = useSelector(state => state.products.status);

    useEffect(() => {
        if (ordersFetchStatus === 'idle') {
            dispatch(fetchOrders());
        }
    });

    useEffect(() => {
        if (productsStatus === 'idle' && ordersFetchStatus === 'succeeded') {
            dispatch(fetchProductsByIds({"ids": [...ordersProductsIds]}));
        }
    });

    const ordersByCreationDate = orders.sort(sorts[sort]).reduce((groups, item) => {
        const group = (groups[item.createdAt.split('T')[0]] || []);
        group.push(item);
        groups[item.createdAt.split('T')[0]] = group;
        return groups;
    }, {});

    const accordionItems = ordersFetchStatus === 'succeeded' && productsStatus === 'succeeded' ? Object.entries(ordersByCreationDate).map((key, value) => {
        return (<Accordion.Item key={key} eventKey={value}>
            <Accordion.Header className="m-0">
                <div className="d-flex justify-content-between">
                    <p className="mb-0 me-5">{key[0]}</p>
                </div>
            </Accordion.Header>
            <Accordion.Body>
                <Accordion>
                    {key[1].map(order =>
                        <Order key={order.id} id={order.id}/>)}
                </Accordion>
            </Accordion.Body>
        </Accordion.Item>)
    }) : <div/>;

    const onSortChanged = (e) => {
        setSort(e.target.value);
    };

    const onFilterChanged = (e) => {
        if (+e.target.value === 3) {
            setFilter(e.target.value);
            dispatch(fetchOrders());
            return;
        }
        setFilter(e.target.value);
        dispatch(fetchOrders(statuses[e.target.value]));
    };

    return (
        <Container>
            <h2 className="mt-2 text-center">Замовлення</h2>
            <div className="d-flex justify-content-between">
                <Form.Select value={filter} onChange={onFilterChanged} className="mt-2 mb-2 w-25">
                    <option value={0}>Нові</option>
                    <option value={1}>В процесі</option>
                    <option value={2}>Виконані</option>
                    <option value={3}>Усі</option>
                </Form.Select>
                <Form.Select value={sort} onChange={onSortChanged} className="mt-2 mb-2 w-25">
                    <option value={0}>Спочатку нові</option>
                    <option value={1}>Спочатку старі</option>
                </Form.Select>
            </div>
            <Accordion>
                {accordionItems}
            </Accordion>
        </Container>
    );
}
