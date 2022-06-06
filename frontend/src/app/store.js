import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import ordersReducer from '../features/orders/ordersSlice'

export default configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        categories: categoriesReducer,
        orders: ordersReducer
    },
})
