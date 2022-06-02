import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {fetchProducts, updateProduct} from "../products/productsSlice";

const cartItems = getCartItems();
const cartAdapter = createEntityAdapter();
const initialState = cartAdapter.getInitialState({
    ...cartItems,
    totalPrice: getCartTotalPrice(cartItems)

});

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
            state.totalPrice = getCartTotalPrice(state);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        deleteFromCart(state, action) {
            const cartItemId = action.payload;
            cartAdapter.removeOne(state, cartItemId);
            state.totalPrice = getCartTotalPrice(state);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        updateCartItem(state, action) {
            const cartItem = {...action.payload};
            cartAdapter.setOne(state, {
                ...cartItem,
                totalPrice: Math.round(((+cartItem.price * +cartItem.countInCart) + Number.EPSILON) * 100) / 100
            });
            state.totalPrice = getCartTotalPrice(state);
            localStorage.setItem('cart', JSON.stringify(state));
        }
    },
    extraReducers(builder) {
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            const updatedProduct = {...action.payload};
            if (getCartItems().entities[updatedProduct.id]) {
                updatedProduct.count = getCartItems().entities[updatedProduct.id].count;

                cartAdapter.upsertOne(state, {
                    ...updatedProduct,
                    totalPrice: Math.round(((+updatedProduct.price * +updatedProduct.count) + Number.EPSILON) * 100) / 100
                });
                state.totalPrice = getCartTotalPrice(state);
                localStorage.setItem('cart', JSON.stringify(state));
            }
        })
    },
});

export const {
    selectAll: selectAllCartItems,
    selectIds: selectAllCartItemsIds,
    selectById: selectCartItemById
} = cartAdapter.getSelectors(state => state.cart);

export const {addToCart, deleteFromCart, updateCartItem} = cartSlice.actions;
export default cartSlice.reducer;

function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {ids: [], entities: {}};
}

function getCartTotalPrice(cartItems) {
    return Object.values(cartItems.entities).reduce((accumulator, current) => accumulator + +current.totalPrice, 0)
}
