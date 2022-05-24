import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

const cartAdapter = createEntityAdapter();
const initialState = cartAdapter.getInitialState(getCartItems());

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const cartItem = action.payload;
            cartAdapter.addOne(state, {
                ...cartItem,
                totalPrice: cartItem.price
            });
            localStorage.setItem('cart', JSON.stringify(state));
        },
        deleteFromCart(state, action) {
            cartAdapter.removeOne(state, action.payload);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateCartItem(state, action) {
            const cartItem = action.payload;
            cartAdapter.setOne(state, {
                ...cartItem,
                totalPrice: Math.round(((+cartItem.price * +cartItem.count) + Number.EPSILON) * 100) / 100
            });
            localStorage.setItem('cart', JSON.stringify(state));
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

export const {addToCart, deleteFromCart, updateCartItem} = cartSlice.actions;
export default cartSlice.reducer;
