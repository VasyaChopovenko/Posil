import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common'

const productsAdapter = createEntityAdapter();
const initialState = productsAdapter.getInitialState({
    status: 'idle',
    error: null,
    updateStatus: 'idle'
});

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (categoryId) => {
    const response = categoryId ? await http.get(`/products?categoryId=${categoryId}`) : await http.get(`/products`);
    return response.data;
});

export const fetchProductsByIds = createAsyncThunk('products/fetchProductsByIds', async (idsBody) => {
    const response = await http.post(`/products/cart`, idsBody);
    return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async(product) => {
    const response = await http.put('/products', product);
    return response.data;
});

export const fetchProductImage = createAsyncThunk('products/fetchImage', async(productId) => {
    const response = await http.get(`/products/${productId}/image`, {responseType: 'blob'});
    return {id: productId, imgUrl: URL.createObjectURL(response.data)};
});

export const updateProductImage = createAsyncThunk('products/updateProductImage', async({formData, productId}) => {
    const response = await http.put(`/products/${productId}/image`, formData);
    return {id: productId, imgUrl: URL.createObjectURL(response.data)};
});

export const addProduct = createAsyncThunk('products/addProduct', async(formData) => {
    const response = await http.post(`/products`, formData, {headers: { "Content-Type": "multipart/form-data" }});
    return response.data;
});

export const addImage = createAsyncThunk('products/addProductImage', async({productId, formData}) => {
    const response = await http.post(`/products/${productId}/image`, formData);
    return {id: productId, imgUrl: URL.createObjectURL(response.data)};
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async(productId) => {
    const response = await http.delete(`/products/${productId}`);
    return productId;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFetchIdleStatus(state, action) {
            state.status = 'idle';
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                productsAdapter.setAll(state, action.payload);
                localStorage.setItem('products', JSON.stringify(state));
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
            .addCase(addImage.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateProductImage.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                productsAdapter.setOne(state, action.payload);
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                productsAdapter.removeOne(state, action.payload);
            })
            .addCase(fetchProductsByIds.fulfilled, (state, action) => {
                productsAdapter.setAll(state, action.payload);
            })


    },
});

export const {setFetchIdleStatus} = productsSlice.actions;

export const {
    selectIds: selectProductsIds,
    selectById: selectProductById
} = productsAdapter.getSelectors(state => state.products);

export default productsSlice.reducer

