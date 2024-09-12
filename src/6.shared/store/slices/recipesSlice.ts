import { createSlice } from "@reduxjs/toolkit";
import { RecipesState } from "../types";
import { ISerializedListRecipe } from "@shared/model/interfaces";

const initialState: RecipesState = {
    isLoading: false,
    error: undefined,
    data: undefined
}

const recipesSlice = createSlice({
    name: "recipes",
    initialState,
    reducers: {
        recipesFetching(state) {
            state.isLoading = true
        },
        recipesFetchingSuccess(state, action: { type: string, payload: Array<ISerializedListRecipe> }) {
            state.isLoading = false
            state.data = action.payload
            state.error = undefined
        },
        recipesFetchingError(state, action: { type: string, payload: number }) {
            state.isLoading = false
            state.data = undefined
            state.error = action.payload
        }
    }
})

export default recipesSlice
export const recipesReducer = recipesSlice.reducer
