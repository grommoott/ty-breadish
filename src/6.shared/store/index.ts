import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { likesReducer } from "./slices/likesSlice"
import { featuredReducer } from "./slices/featuredSlice"
import { productsReducer } from "./slices/productsSlice"
import { recipesReducer } from "./slices/recipesSlice"
import { basketReducer, basketSavingMiddleware } from "./slices/basketSlice"
import { bakeriesReducer } from "./slices/bakeries"

const rootReducer = combineReducers({
    likes: likesReducer,
    featured: featuredReducer,
    products: productsReducer,
    recipes: recipesReducer,
    basket: basketReducer,
    bakeries: bakeriesReducer
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(basketSavingMiddleware)
})

type RootState = ReturnType<typeof rootReducer>
type AppStore = typeof store
type AppDispatch = AppStore['dispatch']

export default store

export {
    RootState,
    AppStore,
    AppDispatch
}
