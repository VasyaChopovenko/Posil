import React from "react";
import {useSelector} from "react-redux";
import {selectOrderById} from "./ordersSlice";
import {Accordion} from "react-bootstrap";
import OrderItem from "./OrderItem";

export default function Order({id}) {
    const order = useSelector(state => selectOrderById(state, id));

    const getCreationDate = (creationDate) => {
        const date = new Date(Date.parse(creationDate));
        return date.toLocaleString('uk-UA');
    };

    const orderItems = order.items.map(item => <OrderItem key={item.id} productId={item.product_id}
                                                          itemCount={item.count}/>);

    return (
        <Accordion.Item eventKey={order.id}>
            <Accordion.Header className="m-0">
                <div className="d-flex justify-content-between">
                    <p style={{minWidth: '5rem', maxWidth: '5rem'}}
                       className="mb-0 me-5">{getCreationDate(order.createdAt).toString().split(', ')[1]}</p>
                    <p style={{minWidth: '7rem', maxWidth: '7rem'}} className="mb-0 me-5">{order.status}</p>
                    <p style={{minWidth: '28rem', maxWidth: '28rem'}}
                       className="mb-0 me-5">{order.clientAddress}</p>
                    <p style={{minWidth: '10rem', maxWidth: '10rem'}} className="mb-0 me-5">{order.clientPhone}</p>
                </div>
            </Accordion.Header>
            <Accordion.Body>
                {orderItems}
            </Accordion.Body>
        </Accordion.Item>
    );
}
