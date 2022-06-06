import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common'

const ordersAdapter = createEntityAdapter();
const initialState = ordersAdapter.getInitialState({
    fetchStatus: 'idle',
    productsIds: []
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await http.get('/orders');
    return response.data;
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
    }
});

export const {
    selectIds: selectAllOrdersIds,
    selectById: selectOrderById
} = ordersAdapter.getSelectors(state => state.orders);

export default ordersSlice.reducer;
