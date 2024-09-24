import { createSlice } from "@reduxjs/toolkit";
import { BasketState } from "../types";

const initialState: BasketState = {}

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setProduct(state, action: { type: string, payload: { productId: number, count: number } }) {
            state[action.payload.productId] = action.payload.count
        },

        removeProduct(state, action: { type: string, payload: number }) {
            state[action.payload] = undefined
        }
    }
})

export default basketSlice
export const basketReducer = basketSlice.reducer
