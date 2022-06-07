import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css"

export default function Counter(props) {
    let [value, setValue] = useState(props.defaultValue);
    let minAmount = props.minAmount;

    const onIncrementClicked = () => {
        const newValue = value + minAmount;
        if (newValue <= props.maxValue) {
            setValue(+newValue.toFixed(1));
            props.onChange(+newValue.toFixed(1));
        }
    };

    const onDecrementClicked = () => {
        const newValue = value - minAmount;
        if (newValue >= minAmount) {
            setValue(+newValue.toFixed(1));
            props.onChange(+newValue.toFixed(1));
        }
    };

    return (
        <div className="d-inline-flex justify-content-center align-content-stretch w-auto counter-container">
            <Button onClick={onDecrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-start border">-</Button>
            <div className="d-flex border-1 border"><input disabled type="number" style={{width: '3rem'}}
                                                           className="no-spinner bg-white border-0 p-2 m-0 rounded-0 border counter_input text-center"
                                                           value={value}/>
                {props.weighable && <span className="p-2">кг</span>}</div>
            <Button onClick={onIncrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-end border">+</Button>
        </div>
    );
}
