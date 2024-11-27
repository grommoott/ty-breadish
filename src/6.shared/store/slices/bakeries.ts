import { createSlice } from "@reduxjs/toolkit";
import { BakeriesState } from "../types";
import { ISerializedBakery } from "@shared/model/interfaces";

const initialState: BakeriesState = {
    isLoading: false,
    error: undefined,
    data: undefined
}

const bakeriesSlice = createSlice({
    name: "bakeries",
    reducers: {
        bakeriesFetching(state) {
            state.isLoading = true
        },
        bakeriesFetchingSuccess(state, action: { type: string, payload: Array<ISerializedBakery> }) {
            state.isLoading = false
            state.error = undefined
            state.data = action.payload
        },
        bakeriesFetchingError(state, action: { type: string, payload: number }) {
            state.isLoading = false
            state.error = action.payload
            state.data = undefined
        },

    },
    initialState
})

export default bakeriesSlice
export const bakeriesReducer = bakeriesSlice.reducer
