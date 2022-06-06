import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchOrders, selectAllOrdersIds} from "./ordersSlice";
import {Accordion} from "react-bootstrap";
import Order from "./Order";
import Container from "react-bootstrap/Container";
import {fetchProductsByIds, selectProductsIds} from "../products/productsSlice";

export default function OrdersList() {
    const dispatch = useDispatch();
    const ordersIds = useSelector(selectAllOrdersIds);
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

    const orders = ordersFetchStatus === 'succeeded' && productsStatus === 'succeeded' ? ordersIds.map(orderId => <Order key={orderId} id={orderId}/>) : <div> test </div>;

    return (
        <Container>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="m-0">
                        <div className="d-flex justify-content-between">
                            <p style={{minWidth: '10rem', maxWidth: '10rem'}} className="mb-0 me-5">Дата створення:</p>
                            <p style={{minWidth: '7rem', maxWidth: '7rem'}} className="mb-0 me-5">Статус:</p>
                            <p style={{minWidth: '28rem', maxWidth: '28rem'}} className="mb-0 me-5">Адреса:</p>
                            <p style={{minWidth: '10rem', maxWidth: '10rem'}} className="mb-0 me-5">Номер клієнта:</p>
                        </div>
                    </Accordion.Header>
                </Accordion.Item>
                {orders}
            </Accordion>
        </Container>
    );
}
