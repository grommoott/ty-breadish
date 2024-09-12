import { ListRecipe } from "@shared/facades";
import { AppDispatch } from "..";
import recipesSlice from "../slices/recipesSlice";
import { ExError } from "@shared/helpers";

function fetchRecipes() {
    return async (dispatch: AppDispatch) => {
        dispatch(recipesSlice.actions.recipesFetching())

        const recipes: Array<ListRecipe> | ExError = await ListRecipe.getRecipesList()

        if (recipes instanceof ExError) {
            dispatch(recipesSlice.actions.recipesFetchingError(recipes.statusCode))
            return
        }

        dispatch(recipesSlice.actions.recipesFetchingSuccess(recipes.map(recipe => recipe.serialize())))
    }
}

export { fetchRecipes }
