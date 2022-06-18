import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import http from '../../http-common';

const categoriesAdapter = createEntityAdapter();
const initialState = categoriesAdapter.getInitialState({
    activeCategory: +localStorage.getItem('categoryId') ?? 1
});

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
    const response = await http.get("/products/categories");
    return response.data;
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        updateCategory(state, action) {
            state.activeCategory = action.payload;
            localStorage.setItem('categoryId', action.payload);
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            categoriesAdapter.setAll(state, action.payload);
        });
    }
});

export const {updateCategory} = categoriesSlice.actions;

export default categoriesSlice.reducer;
export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById
} = categoriesAdapter.getSelectors(state => state.categories);
