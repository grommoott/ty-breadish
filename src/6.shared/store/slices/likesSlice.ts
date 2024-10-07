import { createSlice } from "@reduxjs/toolkit";
import { LikesState } from "../types";
import { ISerializedLike } from "@shared/model/interfaces";

const initialState: LikesState = {
    isLoading: false,
    error: undefined,
    data: undefined
}

const likesSlice = createSlice({
    name: "likes",
    initialState,
    reducers: {
        likesFetching(state) {
            state.isLoading = true
        },
        likesFetchingSuccess(state, action: { type: string, payload: Array<ISerializedLike> }) {
            state.isLoading = false
            state.data = action.payload
            state.error = undefined
        },
        likesFetchingError(state, action: { type: string, payload: number }) {
            state.isLoading = false
            state.data = undefined
            state.error = action.payload
        },
        addLike(state, action: { type: string, payload: ISerializedLike }) {
            state.data?.push(action.payload)
        },
        removeLike(state, action: { type: string, payload: number }) {
            const id = state.data?.findIndex(like => like.id === action.payload) || -1

            if (id != -1) {
                state.data?.splice(id, 1)
            }
        }
    }
})

export default likesSlice
export const likesReducer = likesSlice.reducer
