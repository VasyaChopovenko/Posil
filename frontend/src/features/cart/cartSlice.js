import {createSlice} from "@reduxjs/toolkit";

const cart = localStorage.getItem('cart');
const initialState = cart ? JSON.parse(cart) : [];

const cartSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        addToCart(state, action) {
            const cart = localStorage.getItem('cart');
            const cartItems = cart ? JSON.parse(cart) : [];
            cartItems.push(action.payload);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            state.push(action.payload);
        }
    }
});

export const {addToCart} = cartSlice.actions;
export default cartSlice.reducer;
