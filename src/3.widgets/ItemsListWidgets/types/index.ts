import { CookingMethod, Ingredient } from "@shared/model/types/enums"
import { Dispatch, SetStateAction } from "react"

export * from "./product"
export * from "./recipe"

type ItemFilterDataBase = {
    query: string
    includeIngredients: Array<Ingredient>
    excludeIngredients: Array<Ingredient>
    cookingMethods: Array<CookingMethod>
    onlyFeatured: boolean
}

interface FiltersWindowProps<T> {
    initialFilterData: T,
    setInitialFilterData: Dispatch<SetStateAction<T>>
}

export { FiltersWindowProps, ItemFilterDataBase }
