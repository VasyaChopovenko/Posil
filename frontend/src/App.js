import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavBar from "./app/NavBar";
import {ProductsList} from "./features/products/ProductsList";
import {BrowserRouter, Routes} from "react-router-dom"
import {Route, } from 'react-router-dom';
import Cart from "./features/cart/Cart";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {content: 'default'};
    }

    componentDidMount() {
        document.title = 'Posil';
    }

    render() {
        return (
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route exact path="/" element={<ProductsList/>}/>
                    <Route exact path="/cart" element={<Cart/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}
