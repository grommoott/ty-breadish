import { backendBaseUrl } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IListRecipe, IRecipe, responseDataToRecipe } from "@shared/model/interfaces";
import { ItemInfo, RecipeId } from "@shared/model/types/primitives";
import axios from "axios";

async function getRecipe(id: RecipeId): Promise<IRecipe | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/recipes/id/${id}`)

        return responseDataToRecipe(response.data)
    } catch (e) {
        return errorWrapper(e, "")
    }
}

async function getRecipesList(): Promise<Array<IListRecipe> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/recipes/list`)

        return response.data.map(responseDataToRecipe)
    } catch (e) {
        return errorWrapper(e, "getRecipesList")
    }
}

async function createRecipe(name: string, description: string, itemInfo: ItemInfo, recipe: string): Promise<IRecipe | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/recipes/create`, {
            name,
            description,
            itemInfo,
            recipe
        })

        return responseDataToRecipe(response.data)
    } catch (e) {
        return errorWrapper(e, "createRecipe")
    }
}

async function deleteRecipe(id: RecipeId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/recipes/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "deleteRecipe")
    }
}

async function putRecipe(id: RecipeId, name?: string, description?: string, itemInfo?: ItemInfo, recipe?: string): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/recipes`, {
            id: id.id,
            name,
            description,
            itemInfo,
            recipe
        })
    } catch (e) {
        return errorWrapper(e, "putRecipe")
    }
}

async function checkRecipeImage(id: RecipeId): Promise<void | ExError> {
    try {
        await axios.get(`${backendBaseUrl}/api/recipes/images/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "getRecipeImage")
    }
}

async function createRecipeImage(id: RecipeId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.postForm(`${backendBaseUrl}/api/recipes/images/create`, formData)
    } catch (e) {
        return errorWrapper(e, "createRecipeImage")
    }
}

async function deleteRecipeImage(id: RecipeId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/recipes/images/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "deleteRecipeImage")
    }
}

async function putRecipeImage(id: RecipeId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.putForm(`${backendBaseUrl}/api/recipes/images`, formData)
    } catch (e) {
        return errorWrapper(e, "putRecipeImage")
    }
}
export {
    getRecipe,
    getRecipesList,
    createRecipe,
    deleteRecipe,
    putRecipe,
    checkRecipeImage,
    createRecipeImage,
    deleteRecipeImage,
    putRecipeImage
}
