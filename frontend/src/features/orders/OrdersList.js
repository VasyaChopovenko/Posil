import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectAllOrders, selectAllOrdersIds} from "./ordersSlice";
import {Accordion} from "react-bootstrap";
import Order from "./Order";
import Container from "react-bootstrap/Container";
import {fetchProductsByIds, selectProductsIds} from "../products/productsSlice";

export default function OrdersList() {
    const dispatch = useDispatch();
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

    const ordersByCreationDate = orders.reduce((groups, item) => {
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
    }) : <div>test</div>;

    return (
        <Container>
            <Accordion>
                {accordionItems}
            </Accordion>
        </Container>
    );
}
