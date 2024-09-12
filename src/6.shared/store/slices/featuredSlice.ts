import { createSlice } from "@reduxjs/toolkit";
import { FeaturedState } from "../types";
import { ISerializedFeatured } from "@shared/model/interfaces";
import { FeaturedId } from "@shared/model/types/primitives";

const initialState: FeaturedState = {
    isLoading: false,
    error: undefined,
    data: undefined
}

const featuredSlice = createSlice({
    name: "featured",
    initialState,
    reducers: {
        featuredFetching(state) {
            state.isLoading = true
        },
        featuredFetchingSuccess(state, action: { type: string, payload: Array<ISerializedFeatured> }) {
            state.isLoading = false
            state.data = action.payload
            state.error = undefined
        },
        featuredFetchingError(state, action: { type: string, payload: number }) {
            state.isLoading = false
            state.error = action.payload
            state.data = undefined
        },
        addFeatured(state, action: { type: string, payload: ISerializedFeatured }) {
            state.data?.push(action.payload)
        },
        removeFeatured(state, action: { type: string, payload: FeaturedId }) {
            const id = state.data?.findIndex(featured => featured.id == action.payload.id) || -1

            if (id != -1) {
                state.data?.splice(id, 1)
            }
        }
    }
})

export default featuredSlice
export const featuredReducer = featuredSlice.reducer
