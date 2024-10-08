import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { likesReducer } from "./slices/likesSlice"
import { featuredReducer } from "./slices/featuredSlice"
import { productsReducer } from "./slices/productsSlice"
import { recipesReducer } from "./slices/recipesSlice"
import { basketReducer } from "./slices/basketSlice"

const rootReducer = combineReducers({
    likes: likesReducer,
    featured: featuredReducer,
    products: productsReducer,
    recipes: recipesReducer,
    basket: basketReducer
})

const store = configureStore({
    reducer: rootReducer,
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
