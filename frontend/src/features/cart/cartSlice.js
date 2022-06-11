import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {updateProduct, deleteProduct} from "../products/productsSlice";
import http from "../../http-common";

const cartItems = getCartItems();
const cartAdapter = createEntityAdapter();
const initialState = cartAdapter.getInitialState({
    ...cartItems,
    totalPrice: getCartTotalPrice(cartItems)
});

export const createOrder = createAsyncThunk('cart/createOrder', async ({phone, address}) => {
    const response = await http.post(`/orders`, {"clientAddress": address, "clientPhone": phone, "items": getMappedItems()});
    return response.data;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const cartItem = action.payload;
            cartAdapter.addOne(state, {
                ...cartItem,
                totalPrice: (+cartItem.countInCart * cartItem.price).toFixed(2)
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
        },
    },
    extraReducers(builder) {
        builder
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updatedProduct = {...action.payload};
                const cartItem = getCartItems().entities[updatedProduct.id];
                if (cartItem) {
                    cartAdapter.upsertOne(state, {
                        ...updatedProduct,
                        totalPrice: Math.round(((+updatedProduct.price * +cartItem.countInCart) + Number.EPSILON) * 100) / 100
                    });
                    state.totalPrice = getCartTotalPrice(state);
                    localStorage.setItem('cart', JSON.stringify(state));
                }
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                localStorage.removeItem('cart');
                cartAdapter.removeAll(state);
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

function getMappedItems() {
    const cartItemsToOrder = getCartItems();
    return Object.values(cartItemsToOrder.entities).map(product => {
        return {"count": product.countInCart, "product_id": product.id}
    });
}
