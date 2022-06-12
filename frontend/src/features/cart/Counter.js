import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css"

export default function Counter(props) {
    const count = props.count;
    let minAmount = props.minAmount;
    let [value, setValue] = useState(props.countInCart);

    const alwaysDisabled = props.countInCart < minAmount;

    const getOldValue = () => {
        let oldValue = 0;

        if (value === count && props.weighable) {
            while (oldValue + minAmount <= value) {
                oldValue += minAmount;
            }
        }

        return oldValue;
    };

    let [oldValue, setOldValue] = useState(getOldValue());

    const onIncrementClicked = () => {
        const newValue = value + minAmount;
        if (newValue <= count) {
            setValue(+newValue.toFixed(2));
            props.onChange(+newValue.toFixed(2));
        } else if (!oldValue && props.weighable) {
            setOldValue(value);
            setValue(count);
            props.onChange(count);
        }
    };

    const onDecrementClicked = () => {
        const newValue = value - minAmount;
        if (oldValue) {
            setValue(oldValue);
            props.onChange(oldValue);
            setOldValue(0);
        } else if (newValue >= minAmount) {
            setValue(+newValue.toFixed(2));
            props.onChange(+newValue.toFixed(2));
        }
    };

    return (
        <div className="d-inline-flex justify-content-center align-content-stretch w-auto counter-container">
            <Button disabled={value === minAmount || alwaysDisabled} onClick={onDecrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-start border">-</Button>
            <div className="d-flex border-1 border"><input disabled type="number" style={{width: '3rem'}}
                                                           className="no-spinner bg-white border-0 p-2 m-0 rounded-0 border counter_input text-center"
                                                           value={value}/>
                {props.weighable && <span className="p-2">кг</span>}</div>
            <Button disabled={value === count || alwaysDisabled} onClick={onIncrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-end border">+</Button>
        </div>
    );
}
