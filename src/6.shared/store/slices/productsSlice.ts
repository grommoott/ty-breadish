import { createSlice } from "@reduxjs/toolkit";
import { ProductsState } from "../types";
import { ISerializedListProduct } from "@shared/model/interfaces";

const initialState: ProductsState = {
    isLoading: false,
    error: undefined,
    data: undefined
}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        productsFetching(state) {
            state.isLoading = true
        },
        productsFetchingSuccess(state, action: { type: string, payload: Array<ISerializedListProduct> }) {
            state.isLoading = false
            state.data = action.payload
            state.error = undefined
        },
        productsFetchingError(state, action: { type: string, payload: number }) {
            state.isLoading = false
            state.data = undefined
            state.error = action.payload
        }
    }
})

export default productsSlice
export const productsReducer = productsSlice.reducer
