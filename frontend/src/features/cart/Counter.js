import React from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css"

export default function Counter() {
    return (
        <div className="d-flex justify-content-center align-content-stretch">
            <Button variant="light" className="rounded-0 rounded-start border">-</Button>
            <input type="number" className="no-spinner p-2 m-0 rounded-0 border counter_input w-50 text-center"/>
            <Button variant="light" className="rounded-0 rounded-end border">+</Button>
        </div>
    );
}
