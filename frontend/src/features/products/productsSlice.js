import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common'

const productsAdapter = createEntityAdapter();
const initialState = productsAdapter.getInitialState({
    status: 'idle',
    error: null
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await http.get('/products');
    return response.data;
});

export const fetchProductImg = createAsyncThunk('products/fetchProducts', async (productId) => {
    const response = await http.get(`/products/${productId}/image`);
    return response.data;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                productsAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message
            })
    },
});

export const {
    selectIds: selectProductsIds,
    selectById: selectProductById
} = productsAdapter.getSelectors(state => state.products);

export default productsSlice.reducer

