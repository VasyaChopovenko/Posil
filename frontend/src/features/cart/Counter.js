import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import "./Counter.css"

export default function Counter(props) {
    let [value, setValue] = useState(props.defaultValue);
    let [oldValue, setOldValue] = useState(props.defaultValue);
    let input;

    const onIncrementClicked = () => {
        setValue(++value);
        props.onChange(+value);
    };

    const onDecrementClicked = () => {
        if (value > 1) {
            setValue(--value);
            props.onChange(+value);
        }
    };

    const onCounterChange = (event) => {
        if (event) {
            setOldValue(event);
        }
        setValue(event);
    };

    const onBlur = (event) => {
        if (!event) {
            setValue(oldValue);
            props.onChange(+oldValue);
            return;
        }
        props.onChange(+value);
    };

    return (
        <div className="d-flex justify-content-center align-content-stretch">
            <Button onClick={onDecrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-start border">-</Button>
            <input type="number" className="no-spinner p-2 m-0 rounded-0 border counter_input w-25 text-center"
                   onChange={(event) => onCounterChange(event.target.value)} value={value}
                   onBlur={(event => onBlur(+event.target.value))}/>
            <Button onClick={onIncrementClicked} variant="light" style={{zIndex: 10}}
                    className="counter_btn rounded-0 rounded-end border">+</Button>
        </div>
    );
}
