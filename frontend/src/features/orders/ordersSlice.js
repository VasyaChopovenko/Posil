import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common'

const ordersAdapter = createEntityAdapter();
const initialState = ordersAdapter.getInitialState({
    fetchStatus: 'idle',
    productsIds: []
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (status) => {
    console.log(status);
    const response = !status ? await http.get('/orders') : await http.get(`/orders?status=${status}`);
    return response.data;
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async (body) => {
    const response = await http.put('orders', body);
    return response.data[1][0];
});

const ordersSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                ordersAdapter.setAll(state, action.payload);
                state.productsIds = [...new Set(Object.values(state.entities).reduce((accumulator, current) => accumulator.concat(current.items.map(item => item.product_id)), []))];
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                ordersAdapter.upsertOne(state, action.payload);
            })
    }
});

export const {
    selectAll: selectAllOrders,
    selectById: selectOrderById
} = ordersAdapter.getSelectors(state => state.orders);

export default ordersSlice.reducer;
