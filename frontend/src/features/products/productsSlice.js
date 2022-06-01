import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common'

const productsAdapter = createEntityAdapter();
const products = getProductsFromState();
const initialState = productsAdapter.getInitialState({
    ...products,
    status: 'idle',
    error: null,
    updateStatus: 'idle'
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await http.get('/products');
    return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async(product) => {
    const response = await http.put('/products', product);
    return response.data;
});

export const fetchProductImage = createAsyncThunk('products/fetchImages', async(productId) => {
    const response = await http.get(`/products/${productId}/image`, {responseType: 'blob'});
    return {id: productId, imgUrl: URL.createObjectURL(response.data)};
});

export const updateProductImage = createAsyncThunk('products/updateProductImage', async({formData, productId}) => {
    const response = await http.put(`/products/${productId}/image`, formData);
    return {id: productId, imgUrl: URL.createObjectURL(response.data)};
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
                localStorage.setItem('products', JSON.stringify(state));
                productsAdapter.upsertMany(state, action.payload);
                state.ids.map(id => fetchProductImage(id));
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message
            })
            .addCase(updateProduct.pending, (state, action) => {
                state.updateStatus = 'loading';
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                productsAdapter.setOne(state, action.payload)
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.error.message
            })
            .addCase(fetchProductImage.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateProductImage.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
            })


    },
});

export const {
    selectIds: selectProductsIds,
    selectById: selectProductById
} = productsAdapter.getSelectors(state => state.products);

export default productsSlice.reducer

function getProductsFromState() {
    const cart = localStorage.getItem('products');
    return cart ? JSON.parse(cart) : {ids: [], entities: {}};
}

