import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

const cartAdapter = createEntityAdapter();
const initialState = cartAdapter.getInitialState(getCartItems());

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            // const cartItems = getCartItems();
            // cartItems.push(action.payload);
            cartAdapter.addOne(state, action.payload);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        deleteFromCart(state, action) {
            // const index = cartItems.indexOf(action.payload);
            // cartItems.splice(index, 1);
            // const cartItems = getCartItems();
            cartAdapter.removeOne(state, action.payload);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        incrementCount(state, action) {
            const x = 1;
        }
    }
});

function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {ids: [], entities: {}};
}

export const {
    selectAll: selectAllCartItems,
    selectIds: selectAllCartItemsIds,
    selectById: selectCartItemById
} = cartAdapter.getSelectors(state => state.cart);

export const {addToCart, deleteFromCart} = cartSlice.actions;
export default cartSlice.reducer;
